from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database import Base

class News(Base):
    __tablename__ = "news"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    summary = Column(Text)
    image_url = Column(String)
    url = Column(String, index=True, unique=True)
    published_at = Column(DateTime)
    sentiment = Column(String)
    source = Column(String)
    category = Column(String)
    processing_status = Column(String, default="pending")
