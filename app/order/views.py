from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Company, Office, Order, Provider, User, Utilities

from .serializers import OrderSerializer


class OrderCreateView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data
        user = request.user
        office_id = data.get('office')

        if user.user_type == User.OWNER_USER:
            if not Office.objects.filter(pk=office_id, company__owner=user).exists():
                return Response(
                    {"error": "You do not own this office or it does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

        elif user.user_type == User.MANAGER_USER:
            try:
                Office.objects.get(pk=office_id, manager=user)
            except Office.DoesNotExist:
                return Response(
                    {"error": "No associated office found for this manager."},
                    status=status.HTTP_404_NOT_FOUND
                )

        else:
            return Response(
                {"detail": "You do not have permission to create an order."},
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


class GetOrdersForOfficeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        user = request.user
        office_id = pk

        if user.user_type == User.OWNER_USER:
            if not Office.objects.filter(pk=office_id, company__owner=user).exists():
                return Response(
                    {"error": "You do not own this office or it does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

        elif user.user_type == User.MANAGER_USER:
            try:
                Office.objects.get(pk=office_id, manager=user)
            except Office.DoesNotExist:
                return Response(
                    {"error": "No associated office found for this manager."},
                    status=status.HTTP_404_NOT_FOUND
                )

        else:
            return Response(
                {"detail": "You do not have permission to create an order."},
                status=status.HTTP_403_FORBIDDEN
            )

        order = Order.objects.filter(office=office_id)
        serializer = OrderSerializer(order, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
