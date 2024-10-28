from django.urls import path

from .views import GetAllUtilitiesView, UtilityView, GetUtilityView, GetUtilitiesByTypeView

app_name = 'utility'

urlpatterns = [
    path('utility/', UtilityView.as_view(), name='utility'),
    path('get-all-utilities/<int:pk>/', GetAllUtilitiesView.as_view(), name='get-all-utilities'),
    path('get-utility/<int:pk>/', GetUtilityView.as_view(), name='get-utility'),
    path('get-utility-by-type/<int:office_id>/<int:utility_type>/', GetUtilitiesByTypeView.as_view(),
         name='get-utility-by-type'),

]
