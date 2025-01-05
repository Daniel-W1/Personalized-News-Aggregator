from typing import Dict, Any, List
import requests
from decouple import config

class NewsAPITool:
    """Tool for fetching news content from NewsAPI and MediaStack"""
    
    def __init__(self):
        self.news_api_key = config("news_api_key")
        self.mediastack_api_key = config("media_stack_api_key")

    def fetch_from_mediastack(self, category: str) -> List[Dict[str, Any]]:
        """Fetch news from MediaStack API for a given category"""

        url = "http://api.mediastack.com/v1/news"
        params = {
            "access_key": self.mediastack_api_key,
            "categories": category,
            "limit": 2,
            "sort": "published_desc",
            "sources": "en,-de"
        }
        
        try:
            response = requests.get(url, params=params)
            print(f"MediaStack response: {len(response.json()['data'])}")

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
     
        url = "https://newsapi.org/v2/everything"
        params = {
            "apiKey": self.news_api_key,
            "q": category,
            "pageSize": 2,
            "sortBy": "publishedAt"
        }
        
        try:
            response = requests.get(url, params=params)
            print(f"NewsAPI response: {len(response.json()['articles'])}")

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
        
        # Combine results and remove duplicates based on URL
        seen_urls = set()
        combined_news = []
        
        for item in mediastack_news + newsapi_news:
            url = item.get("url")
            if url and url not in seen_urls:
                seen_urls.add(url)
                combined_news.append(item)
        
        return combined_news