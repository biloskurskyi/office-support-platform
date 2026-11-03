from types import SimpleNamespace

from django.contrib.auth.models import AnonymousUser
from django.test import SimpleTestCase

from core.models import UserType
from core.permissions import IsManager, IsOwner


def _request(user):
    return SimpleNamespace(user=user)


def _user(user_type):
    return SimpleNamespace(is_authenticated=True, user_type=user_type)


class PermissionTests(SimpleTestCase):
    def test_owner_allowed_for_owner_only(self):
        self.assertTrue(IsOwner().has_permission(_request(_user(UserType.OWNER)), None))
        self.assertFalse(IsOwner().has_permission(_request(_user(UserType.MANAGER)), None))

    def test_manager_allowed_for_manager_only(self):
        self.assertTrue(IsManager().has_permission(_request(_user(UserType.MANAGER)), None))
        self.assertFalse(IsManager().has_permission(_request(_user(UserType.OWNER)), None))

    def test_anonymous_denied(self):
        self.assertFalse(IsOwner().has_permission(_request(AnonymousUser()), None))
