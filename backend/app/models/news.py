# model for news aggregated from the news api

from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database import Base

class News(Base):
    __tablename__ = "news"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    image_url = Column(String)
    url = Column(String, index=True, unique=True)
    published_at = Column(DateTime)
    source = Column(String)
    category = Column(String)
