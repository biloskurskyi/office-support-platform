from django.urls import path

from .views import CompanyDetailView, CompanyView

app_name = 'company'

urlpatterns = [
    path('company/', CompanyView.as_view(), name='company'),
    path('company/<int:pk>/', CompanyDetailView.as_view(), name='company-detail'),

]
