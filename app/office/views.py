from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Company, Office, User

from .mixins import OfficeMixin
from .serializers import OfficeSerializer


class OfficeView(OfficeMixin, APIView):
    """
    Allows only owners to create an office. The owner must create the office for a company
    they own and can assign a manager who belongs to the same company.
    """

    def post(self, request):
        user = request.user

        # Validate permissions
        permission_response = self.validate_owner_permission(user)
        if permission_response:
            return permission_response

        data = request.data
        company_id = data.get('company')
        manager_id = data.get('manager')

        company = self.get_company(user, company_id)
        if not company:
            return Response({"error": "Company does not exist or you do not own this company."},
                            status=status.HTTP_400_BAD_REQUEST)

        if manager_id:
            manager = self.get_manager(manager_id)
            if not manager or manager.company != company.name:
                return Response({"error": "Manager does not belong to this company."},
                                status=status.HTTP_400_BAD_REQUEST)

        serializer = OfficeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Office created successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        user = request.user

        # Validate permissions
        permission_response = self.validate_owner_permission(user)
        if permission_response:
            return permission_response

        # Retrieve offices for the company
        offices = Office.objects.filter(company__owner=user.id)
        if not offices.exists():
            return Response({"message": "No offices found for this user"}, status=200)

        serializer = OfficeSerializer(offices, many=True)
        return Response(serializer.data)


class OfficeDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        """
        View to retrieve, update, or delete a specific company.
        """
        if request.user.user_type not in [User.OWNER_USER, User.MANAGER_USER]:
            return Response({'detail': 'You do not have permission to get an office.'},
                            status=status.HTTP_403_FORBIDDEN)

        try:
            office = Office.objects.get(
                pk=pk,
                company__owner=request.user
            ) if request.user.user_type == User.OWNER_USER else Office.objects.get(
                pk=pk,
                manager=request.user
            )
        except Office.DoesNotExist:
            return Response({"error": "Office does not exist or you do not have access."},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = OfficeSerializer(office, many=False)

        return Response(serializer.data)

    def put(self, request, pk):
        """
        Update a specific office by ID (full update).
        """
        user = request.user

        try:
            if user.user_type == User.OWNER_USER:
                office = Office.objects.get(pk=pk, company__owner=user)
            elif user.user_type == User.MANAGER_USER:
                office = Office.objects.get(pk=pk, manager=user)
            else:
                return Response({"error": "You do not have permission to update this office."},
                                status=status.HTTP_403_FORBIDDEN)
        except Office.DoesNotExist:
            return Response({"error": "Office not found or you do not have permission."},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = OfficeSerializer(office, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a specific office by ID.
        """
        permission_response = self.check_permissions(request)
        if permission_response:
            return permission_response

        try:
            if request.user.user_type == User.OWNER_USER:
                office = Office.objects.get(pk=pk, company__owner=request.user)
            else:
                return Response({"error": "You do not have access to delete this office."},
                                status=status.HTTP_403_FORBIDDEN)
        except Office.DoesNotExist:
            return Response({"error": "Office not found or you do not have permission."},
                            status=status.HTTP_404_NOT_FOUND)

        office.delete()
        return Response({'message': 'Office deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


class OfficeListForManager(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        offices = Office.objects.filter(manager=user.id)
        if not offices.exists():
            return Response({"message": "No offices found for you"}, status=200)
        serializer = OfficeSerializer(offices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
