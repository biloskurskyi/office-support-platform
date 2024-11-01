from rest_framework.exceptions import NotFound, PermissionDenied

from core.models import Company, Office, Order, Provider, User, Utilities


class OrderDetailMixin:
    def get_permission_order(self, user, order_id):
        try:
            order = Order.objects.get(pk=order_id)
        except Order.DoesNotExist:
            raise NotFound("Order not found.")

        if user.user_type == User.OWNER_USER:
            if not Office.objects.filter(pk=order.office.pk, company__owner=user).exists():
                raise PermissionDenied("You do not own the office associated with this order.")

        elif user.user_type == User.MANAGER_USER:
            if not Office.objects.filter(pk=order.office.pk, manager=user).exists():
                raise PermissionDenied("You do not manage the office associated with this order.")

        else:
            raise PermissionDenied("You do not have permission to access this order.")

        return order


class OfficePermissionMixin:
    def check_office_permission(self, user, office_id):
        try:
            office = Office.objects.get(pk=office_id)
        except Office.DoesNotExist:
            raise NotFound("Office not found.")

        if user.user_type == User.OWNER_USER:
            if office.company.owner != user:
                raise PermissionDenied("You do not own this office.")

        elif user.user_type == User.MANAGER_USER:
            if office.manager != user:
                raise PermissionDenied("You are not the manager of this office.")

        else:
            raise PermissionDenied("You do not have permission to access this office.")

        return office
