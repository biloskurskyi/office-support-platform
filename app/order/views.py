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
                {"detail": "You do not have permission to get an orders."},
                status=status.HTTP_403_FORBIDDEN
            )

        orders = Order.objects.filter(office=office_id)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        user = request.user
        order_id = pk

        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if user.user_type == User.OWNER_USER:
            if not Office.objects.filter(pk=order.office.pk, company__owner=user).exists():
                return Response(
                    {"error": "You do not own the office associated with this order."},
                    status=status.HTTP_403_FORBIDDEN
                )

        elif user.user_type == User.MANAGER_USER:
            if not Office.objects.filter(pk=order.office.pk, manager=user).exists():
                return Response(
                    {"error": "You do not manage the office associated with this order."},
                    status=status.HTTP_403_FORBIDDEN
                )

        else:
            return Response(
                {"detail": "You do not have permission to access this order."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Serialize and return the order details
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        user = request.user
        order_id = pk

        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if user.user_type == User.OWNER_USER:
            if not Office.objects.filter(pk=order.office.pk, company__owner=user).exists():
                return Response(
                    {"error": "You do not own the office associated with this order."},
                    status=status.HTTP_403_FORBIDDEN
                )

        elif user.user_type == User.MANAGER_USER:
            if not Office.objects.filter(pk=order.office.pk, manager=user).exists():
                return Response(
                    {"error": "You do not manage the office associated with this order."},
                    status=status.HTTP_403_FORBIDDEN
                )

        else:
            return Response(
                {"detail": "You do not have permission to access this order."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = request.user
        order_id = pk

        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if user.user_type == User.OWNER_USER:
            if not Office.objects.filter(pk=order.office.pk, company__owner=user).exists():
                return Response(
                    {"error": "You do not own the office associated with this order."},
                    status=status.HTTP_403_FORBIDDEN
                )

        elif user.user_type == User.MANAGER_USER:
            if not Office.objects.filter(pk=order.office.pk, manager=user).exists():
                return Response(
                    {"error": "You do not manage the office associated with this order."},
                    status=status.HTTP_403_FORBIDDEN
                )

        else:
            return Response(
                {"detail": "You do not have permission to access this order."},
                status=status.HTTP_403_FORBIDDEN
            )

        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GetOrdersProviderOfficeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, office_pk, provider_pk):
        user = request.user
        office_id = office_pk
        provider_id = provider_pk

        try:
            office = Office.objects.get(pk=office_id)
            provider = Provider.objects.get(pk=provider_id)

            if provider.company != office.company:
                return Response(
                    {"error": "This provider does not belong to the company that owns the requested office."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if user.user_type == User.OWNER_USER:
                if office.company.owner != user:
                    return Response(
                        {"error": "You do not own the company that owns this office."},
                        status=status.HTTP_403_FORBIDDEN
                    )

            elif user.user_type == User.MANAGER_USER:
                if office.manager != user:
                    return Response(
                        {"error": "You do not manage this office."},
                        status=status.HTTP_403_FORBIDDEN
                    )
            else:
                return Response(
                    {"detail": "You do not have permission to access orders for this office."},
                    status=status.HTTP_403_FORBIDDEN
                )

            orders = Order.objects.filter(office=office, provider=provider)
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Office.DoesNotExist:
            return Response(
                {"error": "The specified office does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Provider.DoesNotExist:
            return Response(
                {"error": "The specified provider does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
