from typing import Dict, Any
from ..tools.content_tools import NewsAPITool
from datetime import datetime

class ContentRetrieverAgent:
    def __init__(self):
        self.news_tool = NewsAPITool()
        
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Fetch news articles for a given category"""
        category = state.get("category")
        if not category:
            return {
                **state,
                "error": "No category provided",
                "status": "failed"
            }
        
        # Fetch articles from both APIs
        articles = self.news_tool.fetch_all_news(category)
        
        return {
            **state,
            "articles": articles,
            "article_count": len(articles),
            "status": "success",
            "timestamp": datetime.now().isoformat()
        }