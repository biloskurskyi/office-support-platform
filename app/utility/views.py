from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Company, Office, User, Utilities
from office.mixins import OfficeMixin

from .mixins import OfficePermissionMixin, UtilityPermissionMixin
from .serializers import UtilitySerializer


class UtilityView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data
        office_id = data.get('office')

        if request.user.user_type not in [User.OWNER_USER, User.MANAGER_USER]:
            return Response({'detail': 'You do not have permission to get an office.'},
                            status=status.HTTP_403_FORBIDDEN)

        try:
            Office.objects.get(
                pk=office_id,
                company__owner=request.user
            ) if request.user.user_type == User.OWNER_USER else Office.objects.get(
                pk=office_id,
                manager=request.user
            )
        except Office.DoesNotExist:
            return Response({"error": "Office does not exist or you do not have access."},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = UtilitySerializer(data=data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response({"message": "Utility created successfully."}, status=status.HTTP_201_CREATED)
            except IntegrityError as e:
                if 'duplicate key value violates unique constraint' in str(e):
                    return Response(
                        {"error": "Utilities for this office and type already exist for this month."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                return Response({"error": "An unexpected error occurred."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetAllUtilitiesView(OfficeMixin, OfficePermissionMixin, APIView):
    def get(self, request, pk):
        office, permission_response = self.get_office_and_check_permissions(request, pk)
        if permission_response:
            return permission_response

        utilities = Utilities.objects.filter(office=office)
        serializer = UtilitySerializer(utilities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UtilityDetailView(OfficeMixin, UtilityPermissionMixin, APIView):

    def get(self, request, pk):
        utility, permission_response = self.get_utility_with_permission_check(request, pk)
        if permission_response:
            return permission_response

        serializer = UtilitySerializer(utility, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        utility, permission_response = self.get_utility_with_permission_check(request, pk)
        if permission_response:
            return permission_response

        serializer = UtilitySerializer(utility, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        utility, permission_response = self.get_utility_with_permission_check(request, pk)
        if permission_response:
            return permission_response

        utility.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GetUtilitiesByTypeView(OfficeMixin, OfficePermissionMixin, APIView):
    def get(self, request, office_id, utility_type):
        office, permission_response = self.get_office_and_check_permissions(request, office_id)
        if permission_response:
            return permission_response

        utilities = Utilities.objects.filter(office=office, utilities_type=utility_type)
        if not utilities.exists():
            return Response(
                {"error": "No utilities of this type found for the specified office."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UtilitySerializer(utilities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetAllUtilitiesTypesView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, office_id):
        user = request.user

        office = get_object_or_404(Office, id=office_id)

        if (
                (user.user_type == User.OWNER_USER and office.company.owner == user)
                or (user.user_type == User.MANAGER_USER and office.manager == user)
        ):
            utility_types = Utilities.UTILITIES_TYPE_CHOICES
            serialized_data = [
                {'id': utility[0], 'utilities_type': utility[1]}
                for utility in utility_types
            ]
            return Response(serialized_data, status=status.HTTP_200_OK)

        return Response(
            {'detail': 'Access denied.'},
            status=status.HTTP_403_FORBIDDEN
        )
