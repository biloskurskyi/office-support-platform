from rest_framework.permissions import BasePermission

from core.models import UserType


class _HasUserType(BasePermission):
    user_type: int

    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(user and user.is_authenticated and user.user_type == self.user_type)


class IsOwner(_HasUserType):
    message = 'Only company owners can access this resource.'
    user_type = UserType.OWNER


class IsManager(_HasUserType):
    message = 'Only managers can access this resource.'
    user_type = UserType.MANAGER
