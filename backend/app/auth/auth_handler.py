import time
import hashlib
from typing import Dict

import jwt
from decouple import config

from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi import HTTPException, Security



JWT_SECRET = config("secret")
JWT_ALGORITHM = config("algorithm")

security = HTTPBearer()


def token_response(token: str):
    return {
        "access_token": token
    }

def sign_jwt(user: Dict[str, str]) -> Dict[str, str]:
    payload = {
        "user_id": user["user_id"],
        "onboarded": user["onboarded"],
        "expires": time.time() + 600
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return token_response(token)

def decode_jwt(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if decoded_token["expires"] >= time.time() else {}
    except:
        return {}

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    decoded_token = decode_jwt(token)
    if not decoded_token:
        return None
    return decoded_token