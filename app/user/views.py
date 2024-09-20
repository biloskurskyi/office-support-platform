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
