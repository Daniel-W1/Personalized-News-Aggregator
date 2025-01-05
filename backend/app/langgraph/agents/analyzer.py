from typing import Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from datetime import datetime

SENTIMENT_PROMPT = """Analyze the sentiment of the following news article. Your analysis should:
1. Determine the overall tone (positive, negative, neutral) based on the emotional weight and implications of the content.
   - Classify as **positive** if the article highlights beneficial developments, optimistic outlooks, or favorable outcomes.
   - Classify as **negative** if the article focuses on adverse events, pessimistic perspectives, or harmful consequences.
   - Classify as **neutral** if the article is factual, balanced, or lacks strong emotional language.
2. Consider the context, language, and implications of the title and description to guide your classification.

Title: {title}
Description: {description}

Provide the analysis in the following JSON format:
{
    "sentiment": "positive/negative/neutral"
}
"""

class SentimentAnalyzerAgent:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.llm = ChatOpenAI(
            model=config.get("model_name", "gpt-4o-mini"),
            temperature=0.2,
            api_key=config.get("openai_api_key")
        )
        self.prompt = ChatPromptTemplate.from_template(SENTIMENT_PROMPT)

    async def analyze_article(self, article: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze sentiment for a single article"""
        try:
            messages = self.prompt.format_messages(
                title=article.get("title", ""),
                description=article.get("description", "")
            )
            
            response = await self.llm.ainvoke(messages)
            
            # Add sentiment analysis to the article
            return {
                **article,
                "sentiment": response.content
            }
            
        except Exception as e:
            print(f"Error analyzing article sentiment: {str(e)}")
            return {
                **article,
                "sentiment": "unknown",
                "error": str(e)
            }

    async def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Process articles for sentiment analysis"""
        articles = state.get("articles", [])
        
        if not articles:
            return {
                **state,
                "error": "No articles to analyze",
                "status": "failed"
            }

        analyzed_articles = []
        
        # Process each article
        for article in articles:
            analyzed_article = await self.analyze_article(article)
            analyzed_articles.append(analyzed_article)

        return {
            **state,
            "articles": analyzed_articles,
            "analyzed_count": len(analyzed_articles),
            "status": "success",
            "timestamp": datetime.now().isoformat()
        }