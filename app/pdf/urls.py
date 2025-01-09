from django.urls import path

from .views import CompanyPDFView

app_name = 'pdf'

urlpatterns = [
    path('company/pdf/', CompanyPDFView.as_view(), name='company-pdf'),

]
