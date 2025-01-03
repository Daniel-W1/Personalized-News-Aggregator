from typing import Dict, Any, List
from datetime import datetime
from app.models.news import News
from app.database import SessionLocal
import json

class DatabaseAgent:
    def __init__(self):
        pass

    def _extract_sentiment(self, sentiment_str: str) -> str:
        """Extract clean sentiment value from potential JSON string"""
        if isinstance(sentiment_str, str) and "json" in sentiment_str.lower():
            try:
                sentiment_data = json.loads(sentiment_str.replace("```json\n", "").replace("```", ""))
                return sentiment_data.get("sentiment", "neutral")
            except:
                return "neutral"
        return sentiment_str

    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Save processed articles to database"""
        articles = state.get("articles", [])
        
        if not articles:
            return {
                **state,
                "error": "No articles to save",
                "status": "failed"
            }

        db = SessionLocal()
        try:
            for article in articles:
                news_item = News(
                    title=article.get("title"),
                    summary=article.get("summary"),
                    image_url=article.get("image_url"),
                    url=article.get("url"),
                    published_at=datetime.fromisoformat(article.get("published_at")),
                    sentiment=self._extract_sentiment(article.get("sentiment", "neutral")),
                    source=article.get("source", "unknown"),
                    category=article.get("category", "general"),
                    processing_status="completed"
                )
                db.merge(news_item)
            
            db.commit()
            
            return {
                **state,
                "saved_count": len(articles),
                "status": "success",
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            print(f"Database error: {str(e)}")
            db.rollback()
            return {
                **state,
                "error": str(e),
                "status": "failed",
                "timestamp": datetime.now().isoformat()
            }
        finally:
            db.close()