from langgraph.graph import Graph
from langgraph.constants import START
from .agents.content_retriever import ContentRetrieverAgent
from .agents.analyzer import SentimentAnalyzerAgent
from .agents.summarizer import SummarizerAgent
from .agents.database import DatabaseAgent
from typing import Dict, Any

def create_news_processing_graph(config: Dict[str, Any]) -> Graph:
    # Initialize agents
    content_retriever = ContentRetrieverAgent()
    sentiment_analyzer = SentimentAnalyzerAgent(config)
    summarizer = SummarizerAgent(config)
    database = DatabaseAgent()
    # Create graph
    workflow = Graph()
    
    # Add nodes
    workflow.add_node("retrieve", content_retriever.process)
    workflow.add_node("analyze_sentiment", sentiment_analyzer.process)
    workflow.add_node("summarize", summarizer.process)
    workflow.add_node("save_to_db", database.process)
    
    # Add edges
    workflow.add_edge(START, "retrieve")  # Add entry point
    workflow.add_edge("retrieve", "analyze_sentiment")
    workflow.add_edge("analyze_sentiment", "summarize")
    workflow.add_edge("summarize", "save_to_db")

    return workflow.compile()