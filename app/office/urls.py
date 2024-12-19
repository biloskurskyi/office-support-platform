from django.urls import path

from .views import (OfficeDetailView, OfficeListForCompany,
                    OfficeListForManager, OfficeManagersView, OfficeView)

app_name = 'office'

urlpatterns = [
    path('office/', OfficeView.as_view(), name='office'),
    path('office/<int:pk>/', OfficeDetailView.as_view(), name='office-detail'),
    path('office-list/', OfficeListForManager.as_view(), name='office-list-manager'),
    path('office-list-company/<int:pk>/', OfficeListForCompany.as_view(), name='office-list-company'),
    path('office/<int:office_id>/managers/', OfficeManagersView.as_view(), name='office-managers'),
]
