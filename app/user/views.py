import datetime

import jwt
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import User

from .serializers import UserSerializer


class RegisterView(APIView):
    """
    Handles user registration. Validates the provided data, creates a new user, and sends an activation email.

    POST request data should include 'email' and 'password'.
    """

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        email_message = ""

        if user.email:
            subject = 'Activate your account'
            message = (f'Hello {user.name},\n\nPlease activate your account using the following link:'
                       f' http://localhost:8765/api/activate/{user.id}/')
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [user.email]

            try:
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)
                email_message = 'Email sent successfully.'
            except Exception as e:
                email_message = f'Error sending email: {e}'

        return Response(
            {"message": "User created successfully.", "email_status": email_message},
            status=status.HTTP_201_CREATED
        )


class ActivateUserView(APIView):
    """
    Activates a user account. The user must be found by their ID and must not already be active.

    GET request URL should include 'user_id'.
    """

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user.is_active:
            return HttpResponse("User is active.")

        user.is_active = True
        user.save()

        return HttpResponse("User activated successfully.")


class LoginView(APIView):
    """
    Authenticates a user and provides a JWT token upon successful login.

    POST request data should include 'email' and 'password'.
    """

    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()
        if not user or not user.check_password(password) or not user.is_active:
            raise AuthenticationFailed('User not found or password is incorrect')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, 'secret', algorithm='HS256')

        return Response({'jwt': token, 'id': user.id, 'user_type': user.user_type})


class LogoutView(APIView):
    """
    Handles user logout by deleting the JWT cookie.

    Requires authentication.
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
