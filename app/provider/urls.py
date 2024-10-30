from django.urls import path

from .views import ProviderCreateView

app_name = 'provider'

urlpatterns = [
    path('provider/', ProviderCreateView.as_view(), name='provider'),

]
