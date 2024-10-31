from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Company, Office, Provider, User, Utilities

from .serializers import OrderSerializer


class OrderCreateView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data
        user = request.user
        office_id = data.get('office')

        print(f"User: {user}, Office ID: {office_id}")

        if user.user_type == User.OWNER_USER:
            if not Office.objects.filter(pk=office_id, company__owner=user).exists():
                return Response(
                    {"error": "You do not own this company or it does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

        elif user.user_type == User.MANAGER_USER:
            try:
                Office.objects.get(pk=office_id, manager=user)
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

        data['office'] = office_id
        serializer = OrderSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Order created successfully.", "order": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
