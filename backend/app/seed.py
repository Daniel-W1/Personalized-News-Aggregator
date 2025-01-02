from app.database import SessionLocal, engine
from app.models.interest import Interest
from app.models import user as models

# Create tables
models.Base.metadata.create_all(bind=engine)

def seed_interests():
    db = SessionLocal()
    try:
        interests = [
            Interest(name="World News"),
            Interest(name="Politics"), 
            Interest(name="Business"),
            Interest(name="Technology"),
            Interest(name="Science"),
            Interest(name="Health"),
            Interest(name="Sports"),
            Interest(name="Entertainment"),
            Interest(name="Environment"),
            Interest(name="Education")
        ]

        # Add interests to database
        for interest in interests:
            db_interest = db.query(Interest).filter(Interest.name == interest.name).first()
            if not db_interest:
                db.add(interest)
        
        db.commit()

    except Exception as e:
        print(f"Error seeding interests: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_interests()
