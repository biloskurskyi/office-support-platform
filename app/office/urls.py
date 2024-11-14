from django.urls import path

from .views import OfficeDetailView, OfficeListForManager, OfficeView

app_name = 'office'

urlpatterns = [
    path('office/', OfficeView.as_view(), name='office'),
    path('office/<int:pk>/', OfficeDetailView.as_view(), name='office-detail'),
    path('office-list/', OfficeListForManager.as_view(), name='office-list')
]
