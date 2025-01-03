from typing import Dict, Any, List
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from datetime import datetime
from app.models.news import News
from app.database import SessionLocal

SUMMARIZER_PROMPT = """Summarize the following news article concisely while maintaining key information.

Title: {title}
Description: {description}
Sentiment: {sentiment}

Guidelines:
1. Create a clear, concise summary (2-3 sentences)
2. Maintain factual accuracy
3. Include key points and implications
4. Keep the tone consistent with the original
5. Highlight any significant market or industry impact

Provide the summary in a clear, readable format.
"""

class SummarizerAgent:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.llm = ChatOpenAI(
            model=config.get("model_name", "gpt-4o-mini"),
            temperature=0.3,
            api_key=config.get("openai_api_key")
        )
        self.prompt = ChatPromptTemplate.from_template(SUMMARIZER_PROMPT)

    async def summarize_article(self, article: Dict[str, Any]) -> Dict[str, Any]:
        """Generate summary for a single article"""
        try:
                
            messages = self.prompt.format_messages(
                title=article.get("title", ""),
                description=article.get("description", ""),
                sentiment=article.get("sentiment", "neutral")
            )
            
            response = await self.llm.ainvoke(messages)
            
            return {
                **article,
                "summary": response.content
            }
            
        except Exception as e:
            print(f"Error summarizing article: {str(e)}")
            return {
                **article,
                "summary": "",
                "error": str(e)
            }

    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Process and summarize articles"""
        articles = state.get("articles", [])
        
        if not articles:
            return {
                **state,
                "error": "No articles to summarize",
                "status": "failed"
            }

        summarized_articles = []
        
        # Process each article
        for article in articles:
            summarized_article = await self.summarize_article(article)
            summarized_articles.append(summarized_article)

        return {
            **state,
            "articles": summarized_articles,
            "summarized_count": len(summarized_articles),
            "status": "success",
            "timestamp": datetime.now().isoformat()
        }