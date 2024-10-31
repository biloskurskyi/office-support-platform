from django.urls import path

from .views import GetProvidersView, ProviderCreateView

app_name = 'provider'

urlpatterns = [
    path('provider/', ProviderCreateView.as_view(), name='provider'),
    path('provider/<int:pk>/', GetProvidersView.as_view(), name='get-provider'),
]
