import uvicorn
import signal
import sys
from fastapi.middleware.cors import CORSMiddleware
from app.api import app

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

def handle_exit(signum, frame):
    print("\nShutting down gracefully...")
    sys.exit(0)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)
    
    uvicorn.run("app.api:app", host="0.0.0.0", port=8081, reload=True)