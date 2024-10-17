from django.urls import path

from .views import UtilityView

app_name = 'utility'

urlpatterns = [
    path('utility/', UtilityView.as_view(), name='utility'),
]
