from django.urls import path

from .views import CompanyView

app_name = 'company'

urlpatterns = [
    path('company/', CompanyView.as_view(), name='company'),
]
