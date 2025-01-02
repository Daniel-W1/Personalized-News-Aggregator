from sqlalchemy.orm import Session
from app.models.user import User
from app.models.interest import Interest

async def create_user_profile(user_id: int, interest_ids: list[int], db: Session):
    """
    Create user profile by setting interests and marking user as onboarded
    
    Args:
        user_id: ID of the user
        interest_ids: List of interest IDs to associate with user
        db: Database session
    
    Returns:
        Updated user object if successful, None if user not found
    """
    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
        
    # Clear any existing interests
    user.interests = []
    
    # Add selected interests
    for interest_id in interest_ids:
        interest = db.query(Interest).filter(Interest.id == interest_id).first()
        if interest:
            user.interests.append(interest)
    
    # Mark user as onboarded
    user.onboarded = True
    
    # Commit changes
    db.commit()
    db.refresh(user)
    
    return user
