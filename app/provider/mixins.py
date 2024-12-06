from rest_framework import status
from rest_framework.response import Response

from core.models import Company, Office, Provider, User, Utilities


class ProviderDetailMixin:
    def provider_permission_check(self, request, pk):
        user = request.user

        try:
            provider = Provider.objects.get(pk=pk)
        except Provider.DoesNotExist:
            return None, Response(
                {"error": "The specified provider does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Owner check: verify if this provider belongs to a company owned by the user
        if user.user_type == User.OWNER_USER:
            if provider.company.owner != user:
                return None, Response(
                    {"error": "You do not own this provider."},
                    status=status.HTTP_403_FORBIDDEN
                )

        # Manager check: verify if the provider is associated with this office
        elif user.user_type == User.MANAGER_USER:
            if not Office.objects.filter(manager=user, company=provider.company).exists():
                return None, Response(
                    {"error": "You do not manage an office in the company associated with this provider."},
                    status=status.HTTP_403_FORBIDDEN
                )

        else:
            return None, Response(
                {"detail": "You do not have permission to access providers."},
                status=status.HTTP_403_FORBIDDEN
            )

        return provider, None  # Return provider if permission check passes


class ProviderPermissionMixin:
    def check_provider_permissions(self, request, company_id=None, office_pk=None):
        user = request.user

        # Перевірка для власника компанії
        if user.user_type == User.OWNER_USER:
            if company_id and not Company.objects.filter(pk=company_id, owner=user).exists():
                return Response(
                    {"error": "You do not own this company or it does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Перевірка для менеджера компанії
        elif user.user_type == User.MANAGER_USER:
            if company_id:
                if not Office.objects.filter(manager=user.id, company_id=company_id).exists():
                    return Response(
                        {"error": "You are not a manager of this company."},
                        status=status.HTTP_403_FORBIDDEN
                    )

        # Якщо користувач не є власником чи менеджером
        else:
            return Response(
                {"detail": "You do not have permission to access provider data."},
                status=status.HTTP_403_FORBIDDEN
            )

        return None
