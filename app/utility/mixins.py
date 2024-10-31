from rest_framework import status
from rest_framework.response import Response

from core.models import Office, User, Utilities


class OfficePermissionMixin:
    def get_office_and_check_permissions(self, request, office_id):
        """Fetch office and validate user's permission to access it."""
        user = request.user
        try:
            office = Office.objects.get(pk=office_id)
        except Office.DoesNotExist:
            return None, Response(
                {"error": "Office not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Owner access check
        if user.user_type == User.OWNER_USER:
            if not Office.objects.filter(company__owner=user.id, id=office.id).exists():
                return None, Response(
                    {"error": "Owners can only access offices within their own company."},
                    status=status.HTTP_403_FORBIDDEN
                )
            permission_response = self.validate_owner_permission(user)
        else:
            permission_response = self.validate_manager_permission(user, office)

        if permission_response:
            return None, permission_response

        return office, None


class UtilityPermissionMixin:
    def get_utility_with_permission_check(self, request, pk):
        """Retrieve utility and check permissions for the requesting user."""
        user = request.user

        try:
            utility = Utilities.objects.get(pk=pk)
        except Utilities.DoesNotExist:
            return None, Response(
                {"error": "Utility not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        office = utility.office

        if user.user_type == User.OWNER_USER:
            if not Office.objects.filter(company__owner=user.id, id=office.id).exists():
                return None, Response(
                    {"error": "Owners can only access utilities within their own company."},
                    status=status.HTTP_403_FORBIDDEN
                )
            permission_response = self.validate_owner_permission(user)
        else:
            permission_response = self.validate_manager_permission(user, office)

        if permission_response:
            return None, permission_response

        return utility, None
