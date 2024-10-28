from django.urls import path

from .views import GetAllUtilitiesView, UtilityView

app_name = 'utility'

urlpatterns = [
    path('utility/', UtilityView.as_view(), name='utility'),
    path('get-all-utilities/<int:pk>/', GetAllUtilitiesView.as_view(), name='get-all-utilities')
]
