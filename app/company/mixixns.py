from rest_framework import status
from rest_framework.response import Response

from core.models import Company, User

from .serializers import CompanySerializer


class CompanyPermissionMixin:
    def check_permissions(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'},
                            status=status.HTTP_401_UNAUTHORIZED)

        if request.user.user_type != User.OWNER_USER:
            return Response({'detail': 'You do not have permission to perform this action.'},
                            status=status.HTTP_403_FORBIDDEN)

        return None


class CompanyRetrievalMixin:
    def get_company(self, pk):
        try:
            return Company.objects.get(pk=pk)
        except Company.DoesNotExist:
            return None


class CompanyDetailMixin(CompanyPermissionMixin, CompanyRetrievalMixin):
    def get_company_with_owner_check(self, request, pk):
        company = self.get_company(pk)
        if company is None:
            return Response({"message": "Company not found"}, status=status.HTTP_404_NOT_FOUND)
        if company.owner != request.user:
            return Response(
                {'detail': 'You do not have permission to access this company.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return company
