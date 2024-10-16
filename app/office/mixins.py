from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Company, Office, User


class OfficeMixin:
    """
    Mixin to provide shared functionality for office-related views.
    """
    permission_classes = [IsAuthenticated]

    def get_company(self, user, company_id):
        try:
            return Company.objects.get(id=company_id, owner=user.id)
        except Company.DoesNotExist:
            return None

    def get_manager(self, manager_id):
        try:
            return User.objects.get(id=manager_id)
        except User.DoesNotExist:
            return None

    def validate_owner_permission(self, user):
        if user.user_type != User.OWNER_USER:
            return Response({"error": "Only owner users can perform this action."},
                            status=status.HTTP_403_FORBIDDEN)
        return None
