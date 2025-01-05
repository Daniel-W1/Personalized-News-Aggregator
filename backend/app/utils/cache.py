from datetime import datetime, timedelta
from typing import Dict, Any, Tuple

class TTLCache:
    def __init__(self):
        self._cache: Dict[str, Tuple[Any, datetime]] = {}

    def get(self, key: str) -> Any:
        if key in self._cache:
            data, expiry = self._cache[key]
            if datetime.now() < expiry:
                return data
            else:
                del self._cache[key]
        return None

    def set(self, key: str, value: Any, ttl_seconds: int = 300): # 5 minutes
        expiry = datetime.now() + timedelta(seconds=ttl_seconds)
        self._cache[key] = (value, expiry)

    def clear(self):
        self._cache.clear()