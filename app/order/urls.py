from django.urls import path

from .views import OrderCreateView

app_name = 'order'

urlpatterns = [
    path('order/', OrderCreateView.as_view(), name='order'),
]
