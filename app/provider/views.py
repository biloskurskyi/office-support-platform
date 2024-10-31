from django.core.exceptions import ValidationError
from django.db import IntegrityError
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Company, Office, Provider, User, Utilities

from .serializers import ProviderSerializer


class ProviderCreateView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data
        user = request.user

        if user.user_type == User.OWNER_USER:
            company_id = data.get('company')
            if not Company.objects.filter(pk=company_id, owner=user).exists():
                return Response(
                    {"error": "You do not own this company or it does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

        elif user.user_type == User.MANAGER_USER:
            try:
                office = Office.objects.get(manager=user)
                company_id = office.company_id
            except Office.DoesNotExist:
                return Response(
                    {"error": "No associated company found for this manager."},
                    status=status.HTTP_404_NOT_FOUND
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


class GetProvidersView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        user = request.user

        try:
            office = Office.objects.get(pk=pk)
        except Office.DoesNotExist:
            return Response(
                {"error": "The specified office does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Owner check: verify if this office belongs to a company owned by the user
        if user.user_type == User.OWNER_USER:
            if office.company.owner != user:
                return Response(
                    {"error": "You do not own this company or it does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Manager check: verify if the manager is associated with this office
        elif user.user_type == User.MANAGER_USER:
            if office.manager != user:
                return Response(
                    {"error": "You do not manage this office."},
                    status=status.HTTP_403_FORBIDDEN
                )

        else:
            return Response(
                {"detail": "You do not have permission to access providers."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Retrieve all providers linked to the company of the specified office
        providers = Provider.objects.filter(company=office.company)
        serializer = ProviderSerializer(providers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProviderDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        user = request.user

        try:
            provider = Provider.objects.get(pk=pk)
        except Provider.DoesNotExist:
            return Response(
                {"error": "The specified office does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Owner check: verify if this provider belongs to a company owned by the user
        if user.user_type == User.OWNER_USER:
            if provider.company.owner != user:
                return Response(
                    {"error": "You do not own this provider or it does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Manager check: verify if the provider is associated with this office
        elif user.user_type == User.MANAGER_USER:
            if not Office.objects.filter(manager=user, company=provider.company).exists():
                return Response(
                    {"error": "You do not manage an office in the company associated with this provider."},
                    status=status.HTTP_403_FORBIDDEN
                )

        else:
            return Response(
                {"detail": "You do not have permission to access providers."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ProviderSerializer(provider)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        user = request.user

        try:
            provider = Provider.objects.get(pk=pk)
        except Provider.DoesNotExist:
            return Response(
                {"error": "The specified office does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Owner check: verify if this provider belongs to a company owned by the user
        if user.user_type == User.OWNER_USER:
            if provider.company.owner != user:
                return Response(
                    {"error": "You do not own this provider or it does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Manager check: verify if the provider is associated with this office
        elif user.user_type == User.MANAGER_USER:
            if not Office.objects.filter(manager=user, company=provider.company).exists():
                return Response(
                    {"error": "You do not manage an office in the company associated with this provider."},
                    status=status.HTTP_403_FORBIDDEN
                )

        else:
            return Response(
                {"detail": "You do not have permission to access providers."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ProviderSerializer(provider, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = request.user

        try:
            provider = Provider.objects.get(pk=pk)
        except Provider.DoesNotExist:
            return Response(
                {"error": "The specified office does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Owner check: verify if this provider belongs to a company owned by the user
        if user.user_type == User.OWNER_USER:
            if provider.company.owner != user:
                return Response(
                    {"error": "You do not own this provider or it does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Manager check: verify if the provider is associated with this office
        elif user.user_type == User.MANAGER_USER:
            if not Office.objects.filter(manager=user, company=provider.company).exists():
                return Response(
                    {"error": "You do not manage an office in the company associated with this provider."},
                    status=status.HTTP_403_FORBIDDEN
                )

        else:
            return Response(
                {"detail": "You do not have permission to access providers."},
                status=status.HTTP_403_FORBIDDEN
            )

        provider.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
