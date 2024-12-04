from django.core.exceptions import ValidationError
from django.db import IntegrityError
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Company, Office, Provider, User, Utilities

from .mixins import ProviderDetailMixin, ProviderPermissionMixin
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


class GetProvidersView(ProviderPermissionMixin, APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        # response = self.check_provider_permissions(request, office_pk=pk)
        # if isinstance(response, Response):
        #     return response
        #
        # office = Office.objects.get(pk=pk)
        #
        # providers = Provider.objects.filter(company=office.company)
        # serializer = ProviderSerializer(providers, many=True)
        # return Response(serializer.data, status=status.HTTP_200_OK)
        response = self.check_provider_permissions(request, company_id=pk)
        if isinstance(response, Response):  # If the response is an error response
            return response

        # Retrieve all providers linked to the specified company
        providers = Provider.objects.filter(company_id=pk)

        # Serialize the providers and return the data in the response
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
