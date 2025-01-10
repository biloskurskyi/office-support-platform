from django.urls import path

from .views import CompanyManagersPDFView, CompanyPDFView, OfficeListForCompany

app_name = 'pdf'

urlpatterns = [
    path('company/pdf/', CompanyPDFView.as_view(), name='company-pdf'),
    path('company/<int:company_id>/managers/pdf/', CompanyManagersPDFView.as_view(), name='company-managers-pdf'),
    path('company/<int:company_id>/offices/pdf/', OfficeListForCompany.as_view(), name='office-list-pdf'),
]
