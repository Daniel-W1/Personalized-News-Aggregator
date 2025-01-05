from typing import Dict, Any, List
import requests
from datetime import datetime, timedelta
from decouple import config

class NewsAPITool:
    """Tool for fetching news content from NewsAPI and MediaStack"""
    
    def __init__(self):
        self.news_api_key = config("news_api_key")
        self.mediastack_api_key = config("media_stack_api_key")

    def fetch_from_mediastack(self, category: str) -> List[Dict[str, Any]]:
        """Fetch news from MediaStack API for a given category"""
        now = datetime.now()
        one_hour_ago = now - timedelta(hours=1)
        
        url = "http://api.mediastack.com/v1/news"
        params = {
            "access_key": self.mediastack_api_key,
            "categories": category,
            "limit": 2,
            "date_from": one_hour_ago.strftime("%Y-%m-%d,%H:%M"),
            "date_to": now.strftime("%Y-%m-%d,%H:%M"),
            "sort": "published_desc"
        }
        
        try:
            response = requests.get(url, params=params)
            print(f"MediaStack response: {response.json()}")
            if response.status_code == 200:
                data = response.json()
                return [{
                    "title": item.get("title"),
                    "description": item.get("description"),
                    "url": item.get("url"),
                    "image_url": item.get("image"),
                    "published_at": item.get("published_at"),
                    "source": item.get("source"),
                    "category": category,
                } for item in data.get("data", [])]
            return []
        except Exception as e:
            print(f"MediaStack API error: {e}")
            return []

    def fetch_from_newsapi(self, category: str) -> List[Dict[str, Any]]:
        """Fetch news from NewsAPI for a given category"""
        now = datetime.now()
        one_hour_ago = now - timedelta(hours=1)
        
        url = "https://newsapi.org/v2/everything"
        params = {
            "apiKey": self.news_api_key,
            "q": category,
            "pageSize": 2,
            "from": one_hour_ago.isoformat(),
            "to": now.isoformat(),
            "sortBy": "publishedAt"
        }
        
        try:
            response = requests.get(url, params=params)
            print(f"NewsAPI response: {response.json()}, category: {category}")
            if response.status_code == 200:
                data = response.json()
                return [{
                    "title": item.get("title"),
                    "description": item.get("description"),
                    "url": item.get("url"),
                    "image_url": item.get("urlToImage"),
                    "published_at": item.get("publishedAt"),
                    "source": item.get("source", {}).get("name"),
                    "category": category,
                } for item in data.get("articles", [])]
            return []
        except Exception as e:
            print(f"NewsAPI error: {e}")
            return []

    def fetch_all_news(self, category: str) -> List[Dict[str, Any]]:
        """Fetch news from both APIs and combine results"""
        # Get news from both sources

        mediastack_news = self.fetch_from_mediastack(category)
        newsapi_news = self.fetch_from_newsapi(category)

        print(f"Mediastack news: {len(mediastack_news)}")
        print(f"NewsAPI news: {len(newsapi_news)}")
        
        # Combine results and remove duplicates based on URL
        seen_urls = set()
        combined_news = []
        
        for item in mediastack_news + newsapi_news:
            url = item.get("url")
            if url and url not in seen_urls:
                seen_urls.add(url)
                combined_news.append(item)
        
        return combined_news