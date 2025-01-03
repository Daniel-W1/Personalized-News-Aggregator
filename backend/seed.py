from app.database import SessionLocal, engine
from app.models.interest import Interest
from app.models.news import News  # Add this import
from app.models import user as models
from app.models.user import Base  # Add this import

# Drop all existing tables
Base.metadata.drop_all(bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)

def seed_interests():
    db = SessionLocal()
    try:
        interests = [
            Interest(name="general"),
            Interest(name="business"), 
            Interest(name="entertainment"),
            Interest(name="health"),
            Interest(name="science"),
            Interest(name="technology"),
            Interest(name="sports")
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