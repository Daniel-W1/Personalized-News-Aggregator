from fastapi import FastAPI, Body, Depends
from sqlalchemy.orm import Session
from app.auth.auth_handler import sign_jwt, hash_password, get_current_user
from app.request_schemas import UserSignupSchema, UserLoginSchema
from app.database import get_db, engine
from app.models.user import User
from app.models import user as models
from app.models.interest import Interest
from app.request_schemas import UserInterestsCreateUpdateSchema
from app.profile.profile_handler import create_user_profile
from app.aggregator.aggregation_job import aggregate_news
import asyncio
from contextlib import asynccontextmanager

# Create tables
models.Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(aggregate_news())
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "running", "success": True}

@app.post("/signup", tags=["user"])
async def create_user(user: UserSignupSchema = Body(...), db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        return {
            "message": "Email already registered",
            "success": False
        }
    
    hashed_password = hash_password(user.password)
    # Create new user
    db_user = User(
        firstname=user.firstname,
        lastname=user.lastname,
        email=user.email,
        password=hashed_password,
        onboarded=False
    )

    await create_user_profile(db_user.id, user.interests, db)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    token_response = sign_jwt({"user_id": db_user.id, "onboarded": db_user.onboarded})
    return {**token_response, "success": True}

@app.post("/login", tags=["user"])
async def login_user(user: UserLoginSchema = Body(...), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        return {
            "message": "Invalid credentials",
            "success": False
        }
    if db_user.password != hash_password(user.password):
        return {
            "message": "Invalid credentials", 
            "success": False
        }
    token_response = sign_jwt({"user_id": db_user.id, "onboarded": db_user.onboarded})
    return {**token_response, "success": True}

@app.get("/user/{user_id}", tags=["user"])
async def get_user(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if not current_user:
        return {
            "message": "Unauthorized",
            "success": False
        }
    
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return {
            "message": "User not found",
            "success": False
        }
    return {
        "data": db_user,
        "success": True
    }

@app.get("/interests", tags=["interests"])
async def get_interests(
    db: Session = Depends(get_db)
):
    interests = db.query(Interest).all()
    return {"data": interests, "success": True}

@app.put("/users/me/interests", tags=["interests"])
async def update_user_interests(
    interests: UserInterestsCreateUpdateSchema = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user:
        return {"message": "Unauthorized", "success": False}
    
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        return {"message": "User not found", "success": False}
    
    # Clear existing interests
    user.interests = []
    
    # Add new interests
    for interest_id in interests.interest_ids:
        interest = db.query(Interest).filter(Interest.id == interest_id).first()
        if interest:
            user.interests.append(interest)
    
    db.commit()
    return {"message": "Interests updated successfully", "success": True}

@app.get("/users/me/interests", tags=["user"])
async def get_user_interests(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    if not current_user:
        return {"message": "Unauthorized", "success": False}
    
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        return {"message": "User not found", "success": False}
    
    return {"data": user.interests, "success": True}