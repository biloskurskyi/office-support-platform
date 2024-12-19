from django.urls import path

from .views import (GetAllUtilitiesTypesView, GetAllUtilitiesView,
                    GetUtilitiesByTypeView, UtilityDetailView, UtilityView)

app_name = 'utility'

urlpatterns = [
    path('utility/', UtilityView.as_view(), name='utility'),
    path('get-all-utilities/<int:pk>/', GetAllUtilitiesView.as_view(), name='get-all-utilities'),
    path('utility/<int:pk>/', UtilityDetailView.as_view(), name='utility-detail'),
    path('get-utility-by-type/<int:office_id>/<int:utility_type>/', GetUtilitiesByTypeView.as_view(),
         name='get-utility-by-type'),
    path('utilities/types/', GetAllUtilitiesTypesView.as_view(), name='get-all-utilities-types'),

]
