from django.urls import path

from .views import (GetOrdersForOfficeView, GetOrdersProviderOfficeView,
                    OrderCreateView, OrderDetailView)

app_name = 'order'

urlpatterns = [
    path('order/', OrderCreateView.as_view(), name='order'),
    path('get-all-orders-for-office/<int:pk>/', GetOrdersForOfficeView.as_view(), name='get-all-orders-for-office'),
    path('get-all-orders-provider-office/<int:office_pk>/<int:provider_pk>/', GetOrdersProviderOfficeView.as_view(),
         name='get-all-orders-provider-office'),
    path('order/<int:pk>/', OrderDetailView.as_view(), name='order-detail')
]
