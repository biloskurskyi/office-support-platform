from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response

from core.models import Company, User


class ManagerOwnershipMixin:
    def get_manager(self, request, pk):
        user = request.user

        # Ensure the user is an OWNER
        if user.user_type != User.OWNER_USER:
            return None, Response({"error": "Invalid user type."}, status=status.HTTP_400_BAD_REQUEST)

        # Get the manager by pk
        manager = get_object_or_404(User, pk=pk, user_type=User.MANAGER_USER)

        # Check if the manager belongs to the company of the owner
        if not Company.objects.filter(owner=user, id=manager.company).exists():
            return None, Response({"error": "This manager does not belong to your company."},
                                  status=status.HTTP_403_FORBIDDEN)

        return manager, None
