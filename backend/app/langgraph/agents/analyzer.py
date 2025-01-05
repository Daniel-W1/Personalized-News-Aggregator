from typing import Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from datetime import datetime

SENTIMENT_PROMPT = """Analyze the sentiment of the following news article. Your analysis should:
1. Determine the overall tone (positive, negative, neutral) based on the emotional weight and implications of the content.
2. Consider the context, language, and implications of the title and description to guide your classification.

Title: {title}
Description: {description}

Provide the analysis in the following JSON format:
{{
    "sentiment": "positive/negative/neutral"
}}
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

            # Clean the response by removing markdown code block syntax
            cleaned_response = response.content
            if cleaned_response.startswith("```"):
                # Remove the first line (```json) and last line (```)
                cleaned_response = "\n".join(cleaned_response.split("\n")[1:-1])
            
            # Parse the JSON response
            import json
            sentiment_data = json.loads(cleaned_response)
            
            return {
                **article,
                "sentiment": sentiment_data["sentiment"]
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