from django.urls import path

from .views import (CurrencyListView, GetOfficeProvidersView, GetProvidersView,
                    ProviderAccessCheckAPIView, ProviderCreateView,
                    ProviderDetailView)

app_name = 'provider'

urlpatterns = [
    path('provider/', ProviderCreateView.as_view(), name='provider'),
    path('get-all-providers/<int:pk>/', GetProvidersView.as_view(), name='get-all-providers'),
    path('get-all-providers-by-office/<int:office_pk>/', GetOfficeProvidersView.as_view(),
         name='get-all-providers-by-office'),
    path('provider/<int:pk>/', ProviderDetailView.as_view(), name='provider-detail'),
    path('access-provider-check/<int:pk>', ProviderAccessCheckAPIView.as_view(), name='access-provider-check'),
    path("currencies/", CurrencyListView.as_view(), name="currency-list"),

]
