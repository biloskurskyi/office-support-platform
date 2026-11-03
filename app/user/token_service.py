import datetime
from typing import Any, Dict

import jwt
from django.conf import settings

ALGORITHM = 'HS256'
TOKEN_LIFETIME = datetime.timedelta(minutes=60)


class TokenService:
    """Issues and verifies signed JWT access tokens."""

    @staticmethod
    def issue(user) -> str:
        now = datetime.datetime.now(datetime.timezone.utc)
        payload = {'id': user.id, 'iat': now, 'exp': now + TOKEN_LIFETIME}
        return jwt.encode(payload, settings.JWT_SECRET, algorithm=ALGORITHM)

    @staticmethod
    def decode(token: str) -> Dict[str, Any]:
        """Raises jwt.ExpiredSignatureError / jwt.InvalidTokenError."""
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
