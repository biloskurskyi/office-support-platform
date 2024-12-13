from django.core.exceptions import ValidationError
from django.db import IntegrityError
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Company, Office, Provider, User, Utilities, Order

from .mixins import ProviderDetailMixin, ProviderPermissionMixin
from .serializers import ProviderSerializer


class ProviderCreateView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data
        user = request.user

        if user.user_type == User.OWNER_USER:
            company_id = data.get('company_id')

            if not Company.objects.filter(pk=company_id, owner=user).exists():
                return Response(
                    {"error": "You do not own this company or it does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

        elif user.user_type == User.MANAGER_USER:
            try:
                offices = Office.objects.filter(manager=user.id)
                if not offices.exists():
                    return Response(
                        {"error": "No associated company found for this manager."},
                        status=status.HTTP_404_NOT_FOUND
                    )
                company_id = offices.first().company_id

            except Exception as error:
                return Response(
                    {"error": f"An unexpected error occurred: {str(error)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        else:
            return Response(
                {"detail": "You do not have permission to create a provider."},
                status=status.HTTP_403_FORBIDDEN
            )

        data['company'] = company_id

        serializer = ProviderSerializer(data=data)
        if serializer.is_valid():
            try:
                company = Company.objects.get(pk=company_id)
                serializer.save(company=company)
                return Response(
                    {"message": "Provider created successfully."},
                    status=status.HTTP_201_CREATED
                )
            except ValidationError as e:
                return Response(
                    {"error": e.message_dict},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except IntegrityError as e:
                if 'duplicate key value violates unique constraint' in str(e):
                    return Response(
                        {"error": "A provider with this unique identifier already exists."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                return Response({"error": "An unexpected error occurred."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetProvidersView(ProviderPermissionMixin, APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        response = self.check_provider_permissions(request, company_id=pk)
        if isinstance(response, Response):
            return response

        providers = Provider.objects.filter(company_id=pk)

        serializer = ProviderSerializer(providers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetOfficeProvidersView(ProviderPermissionMixin, APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, office_pk):
        response = self.check_provider_permissions(request, office_pk=office_pk)
        if isinstance(response, Response):
            return response

        office = Office.objects.filter(pk=office_pk).first()
        if not office:
            return Response(
                {"error": "Office not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        providers = Provider.objects.filter(company=office.company)
        serializer = ProviderSerializer(providers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProviderDetailView(ProviderDetailMixin, APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        provider, error_response = self.provider_permission_check(request, pk)
        if error_response:
            return error_response

        serializer = ProviderSerializer(provider)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        provider, error_response = self.provider_permission_check(request, pk)
        if error_response:
            return error_response

        serializer = ProviderSerializer(provider, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        provider, error_response = self.provider_permission_check(request, pk)
        if error_response:
            return error_response

        provider.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProviderAccessCheckAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        user = request.user

        if user.user_type == User.OWNER_USER:
            company = Company.objects.filter(id=pk, owner=user).first()
            if not company:
                return Response(
                    {"error": "You are not the owner of this company or the company does not exist."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        elif user.user_type == User.MANAGER_USER:
            office_exists = Office.objects.filter(manager=user, company_id=pk).exists()
            if not office_exists:
                return Response(
                    {"error": "You are not the manager of this company."},
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            return Response(
                {"error": "You do not have permission to access this page."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(
            {"message": "Access is allowed."},
            status=status.HTTP_200_OK,
        )


class CurrencyListView(APIView):
    # permission_classes = (IsAuthenticated,)
    def get(self, request):
        currencies = [{"id": id, "label": label} for id, label in Order.CURRENCY_TYPE_CHOICES]
        return Response(currencies)
