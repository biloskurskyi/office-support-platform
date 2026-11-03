import datetime
from types import SimpleNamespace

import jwt
from django.conf import settings
from django.test import SimpleTestCase

from user.token_service import TokenService


class TokenServiceTests(SimpleTestCase):
    def test_round_trip(self):
        token = TokenService.issue(SimpleNamespace(id=42))
        self.assertEqual(TokenService.decode(token)['id'], 42)

    def test_expired_token(self):
        past = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=2)
        token = jwt.encode({'id': 1, 'exp': past}, settings.JWT_SECRET, algorithm='HS256')
        with self.assertRaises(jwt.ExpiredSignatureError):
            TokenService.decode(token)

    def test_foreign_key_rejected(self):
        token = jwt.encode({'id': 1}, 'another-secret', algorithm='HS256')
        with self.assertRaises(jwt.InvalidTokenError):
            TokenService.decode(token)
