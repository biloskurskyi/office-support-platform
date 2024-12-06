from django.urls import path

from .views import GetProvidersView, ProviderCreateView, ProviderDetailView, ProviderAccessCheckAPIView

app_name = 'provider'

urlpatterns = [
    path('provider/', ProviderCreateView.as_view(), name='provider'),
    path('get-all-providers/<int:pk>/', GetProvidersView.as_view(), name='get-all-providers'),
    path('provider/<int:pk>/', ProviderDetailView.as_view(), name='provider-detail'),
    path('access-provider-check/<int:pk>', ProviderAccessCheckAPIView.as_view(), name='access-provider-check'),

]
