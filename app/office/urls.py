from django.urls import path

from .views import OfficeCreateView

app_name = 'office'

urlpatterns = [
    path('office/', OfficeCreateView.as_view(), name='office'),
]
