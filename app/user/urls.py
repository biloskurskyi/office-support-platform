from django.urls import path

from .views import (ActivateUserView, ChangeActiveStatusManagerView,
                    ChangePasswordView, CreateManagerView, GetUserView,
                    LoginView, LogoutView, RegisterView, UpdateUserView)

app_name = 'user'

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('activate/<int:user_id>/', ActivateUserView.as_view(), name='activate_user'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register-manager/', CreateManagerView.as_view(), name='register-manager'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('get-user/', GetUserView.as_view(), name='get-user'),
    path('update-user/', UpdateUserView.as_view(), name='update-user'),
    path('change-manager-status/<int:pk>/', ChangeActiveStatusManagerView.as_view(), name='change-manager-status/'),
]
