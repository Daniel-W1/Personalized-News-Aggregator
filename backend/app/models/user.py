from sqlalchemy import Boolean, Column, Integer, String
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    firstname = Column(String)
    lastname = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    onboarded = Column(Boolean, default=False)