import aiohttp
import asyncio
from datetime import datetime, timedelta
from app.database import SessionLocal
from app.models.news import News
from app.models.interest import Interest
from decouple import config

async def fetch_news_from_mediastack(session, category):
    """Fetch news from MediaStack API for a given category"""
    now = datetime.now()
    one_hour_ago = now - timedelta(hours=1)
    
    url = "http://api.mediastack.com/v1/news"
    params = {
        "access_key": config("media_stack_api_key"),
        "categories": category,
        "limit": 100,
        "date_from": one_hour_ago.strftime("%Y-%m-%d,%H:%M"),
        "date_to": now.strftime("%Y-%m-%d,%H:%M"),
        "sort": "published_desc"
    }
    
    async with session.get(url, params=params) as response:
        if response.status == 200:
            data = await response.json()
            return data.get("data", [])
    return []

async def fetch_news_from_newsapi(session, category):
    """Fetch news from NewsAPI for a given category"""
    now = datetime.now()
    one_hour_ago = now - timedelta(hours=1)
    
    url = "https://newsapi.org/v2/everything"
    params = {
        "apiKey": config("news_api_key"),
        "q": category,
        "pageSize": 100,
        "from": one_hour_ago.isoformat(),
        "to": now.isoformat(),
        "sortBy": "publishedAt"
    }
    
    async with session.get(url, params=params) as response:
        if response.status == 200:
            data = await response.json()
            return data.get("articles", [])
    return []

async def aggregate_news():
    """Aggregate news from multiple sources for all categories"""
    db = SessionLocal()
    try:
        categories = db.query(Interest).all()
        
        async with aiohttp.ClientSession() as session:
            for category in categories:
                # Fetch from both APIs concurrently
                mediastack_task = fetch_news_from_mediastack(session, category.name)
                newsapi_task = fetch_news_from_newsapi(session, category.name)
                
                mediastack_news, newsapi_news = await asyncio.gather(
                    mediastack_task,
                    newsapi_task
                )
                
                # Create sets for efficient URL checking
                news_items = []
                seen_urls = set() # to prevent duplicates from both sources
                
                # Process MediaStack news
                for item in mediastack_news:
                    url = item.get("url")
                    if url and url not in seen_urls:
                        seen_urls.add(url)
                        news_items.append(News(
                            title=item.get("title"),
                            description=item.get("description"),
                            url=url,
                            image_url=item.get("image"),
                            published_at=datetime.strptime(item.get("published_at"), "%Y-%m-%dT%H:%M:%S%z"),
                            source=item.get("source"),
                            category=category.name
                        ))
                
                # Process NewsAPI news
                for item in newsapi_news:
                    url = item.get("url")
                    if url and url not in seen_urls:
                        seen_urls.add(url)
                        news_items.append(News(
                            title=item.get("title"),
                            description=item.get("description"),
                            url=url,
                            image_url=item.get("urlToImage"),
                            published_at=datetime.strptime(item.get("publishedAt"), "%Y-%m-%dT%H:%M:%S%z"),
                            source=item.get("source", {}).get("name"),
                            category=category.name
                        ))
                
                # Bulk insert all new items
                if news_items:
                    db.bulk_save_objects(news_items)
            
            db.commit()

            print(f"News aggregated for category: {category.name}")
    except Exception as e:
        print(f"Error aggregating news: {e}")
        db.rollback()
    finally:
        db.close()
    
    await asyncio.sleep(3600) # run every hour
