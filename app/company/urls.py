from django.urls import path

from .views import (CompanyDetailView, CompanyManagersView, CompanyView,
                    VerifyCompanyOwnership)

app_name = 'company'

urlpatterns = [
    path('company/', CompanyView.as_view(), name='company'),
    path('company/<int:pk>/', CompanyDetailView.as_view(), name='company-detail'),
    path('company/<int:company_id>/managers/', CompanyManagersView.as_view(), name='company-managers'),
    path('company/<int:company_id>/verify-ownership/', VerifyCompanyOwnership.as_view(),
         name='company-verify-ownership')

]
