# FutureNews

FutureNews is a full-stack application that provides AI-powered news summaries and sentiment analysis. It uses FastAPI for the backend, Next.js for the frontend, and integrates with various news APIs and OpenAI's language models.

## Features

- User authentication and profile management
- Personalized news feed based on user interests
- AI-powered news summarization and sentiment analysis
- Bookmark favorite articles
- Dark/Light theme support
- Responsive design

## Architecture

### Backend (FastAPI)

- **Authentication**: JWT-based authentication system
- **Database**: SQLite with SQLAlchemy ORM
- **AI Processing Pipeline**: 
  - LangGraph for orchestrating AI processing
  - OpenAI integration for summarization and sentiment analysis
  - News aggregation from multiple sources (NewsAPI and MediaStack)
- **Caching**: TTL-based caching for API responses

### Frontend (Next.js)

- **UI Framework**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and local storage
- **Authentication**: Token-based with protected routes

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 20+
- OpenAI API key
- NewsAPI key
- MediaStack API key

### Backend Setup

1. Create a virtual environment:

```
conda create -n futurenews python=3.11
```


2. Activate the environment:
```
conda activate futurenews
```

3. Install dependencies:
```
pip install -r requirements.txt
```

4. Create a `.env` file with the following variables:
```
secret=your_jwt_secret
algorithm=HS256
openai_api_key=your_openai_api_key
news_api_key=your_newsapi_key
media_stack_api_key=your_mediastack_ke
```

4. Initialize the database:

```
python backend/seed.py
```

5. Run the backend:

```
python backend/main.py
```

### Frontend Setup

1. Navigate to the frontend directory:

```
cd frontend
```

2. Install dependencies:

```
npm install
```

3. Run the frontend:

```
npm run dev
```


### Docker Setup

Alternatively, use Docker Compose to run both services:

add the .env at the root of the project for the docker-compose.yml file to work

```
docker-compose up --build
```

This will start both the backend and frontend containers.


## External APIs and Libraries

### Backend Dependencies
- FastAPI: Web framework
- SQLAlchemy: ORM
- LangChain & LangGraph: AI orchestration
- OpenAI: Text processing
- NewsAPI & MediaStack: News sources

### Frontend Dependencies
- Next.js: React framework
- Tailwind CSS: Styling
- shadcn/ui: UI components
- Axios: HTTP client

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Support

For support, please open an issue in the GitHub repository.

