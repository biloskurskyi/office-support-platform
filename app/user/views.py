import datetime
import random
import string

import jwt
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.settings import FRONTEND_BASE_URL
from core.models import Company, User

from .mixins import ManagerOwnershipMixin
from .serializers import (ChangePasswordSerializer, GetManagerUserSerializer,
                          GetOwnerUserSerializer, UserSerializer)


class RegisterView(APIView):
    """
    Handles user registration. Validates the provided data, creates a new user, and sends an activation email.

    POST request data should include 'email' and 'password'.
    """

    def post(self, request):
        user_type = request.data.get('user_type')

        if user_type is not None and int(user_type) != User.OWNER_USER:
            return Response(
                {"detail": "Only owner users can register directly."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        email_message = ""

        frontend_base_url = FRONTEND_BASE_URL

        if user.email:
            subject = 'Activate your account'
            activation_token = self.generate_activation_token(user.id)
            activation_link = f'{frontend_base_url}/activate-user/{activation_token}/'
            message = (
                f"Вітаємо, {user.name}!\n\n"
                f"Для активації вашого акаунта, будь ласка, перейдіть за наступним посиланням:\n{activation_link}\n\n"
                f"Якщо ви не створювали обліковий запис, просто проігноруйте цей лист.\n\n"
            )
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

    def generate_activation_token(self, user_id):
        """
        Generate a secure token for account activation.
        """
        serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
        return serializer.dumps({"user_id": user_id})


class ActivateUserView(APIView):
    """
    Activates a user account. The user must be found by their ID and must not already be active.

    GET request URL should include 'user_id'.
    """

    def get(self, request, token):
        serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

        try:
            # Розшифровуємо токен
            data = serializer.loads(token, max_age=259200)  # 1 година (3600 секунд)
            user_id = data.get("user_id")

            # Знаходимо користувача
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Користувача не знайдено.'}, status=status.HTTP_404_NOT_FOUND)

            # Перевіряємо статус активації
            if user.is_active:
                return JsonResponse({
                    'message': "Ви вже успішно активували свій акаунт раніше.\n"
                               "Тепер ви можете увійти до системи та використовувати її функціонал."
                })

            # Активуємо акаунт
            user.is_active = True
            user.is_confirmed = True
            user.save()

            return JsonResponse({
                'message': "Вітаємо! Ви успішно активували свій акаунт.\n"
                           "Тепер ви можете увійти до системи та використовувати її функціонал."
            })

        except SignatureExpired:
            return JsonResponse({"error": "The activation token has expired."}, status=status.HTTP_400_BAD_REQUEST)
        except BadSignature:
            return JsonResponse({"error": "Invalid activation token."}, status=status.HTTP_400_BAD_REQUEST)


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


class CreateManagerView(RegisterView):
    """
    Allows owners to create manager users.
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        owner = request.user
        if not owner.is_owner():
            return Response({'detail': 'You do not have permission to create a manager.'},
                            status=status.HTTP_403_FORBIDDEN)

        data = request.data

        if 'company' not in data:
            return Response({'detail': 'Company ID is required for manager creation.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            company = Company.objects.get(id=data['company'])
        except Company.DoesNotExist:
            return Response({'detail': 'Company not found.'}, status=status.HTTP_404_NOT_FOUND)

        if company.owner.id != owner.id:
            return Response({'detail': 'You can only assign managers to your own company.'},
                            status=status.HTTP_403_FORBIDDEN)

        data['user_type'] = User.MANAGER_USER

        random_password = self.generate_random_password()

        data['password'] = random_password

        frontend_base_url = FRONTEND_BASE_URL

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            manager = serializer.save()

            token = self.generate_activation_token(manager.id)

            activation_link = f'{frontend_base_url}/activate-user/{token}/'

            subject = 'Manager Account Has Been Created. Activate Your Account!'
            message = (
                f"Вітаємо, {manager.name}!\n\n"
                f"Ваш обліковий запис було створено. Ось ваш тимчасовий пароль: {random_password}\n"
                f"Для активації вашого акаунта перейдіть за наступним посиланням:\n{activation_link}\n\n"
                f"Не забудьте змінити свій пароль після входу.")

            from_email = settings.EMAIL_HOST_USER
            recipient_list = [manager.email]

            try:
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)
                email_message = 'Email sent successfully.'
            except Exception as e:
                email_message = f'Error sending email: {e}'

            return Response({"message": "Manager created successfully.", "email_status": email_message},
                            status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def generate_random_password(self, length=10):
        """
        Generate a random password consisting of letters and digits.
        """
        characters = string.ascii_letters + string.digits
        return ''.join(random.choice(characters) for i in range(length))

    def generate_session_token(self, manager_id):
        """
        Generate a secure token with the manager's ID and timestamp.
        """
        serializer = URLSafeTimedSerializer(settings.SECRET_KEY)
        return serializer.dumps({"manager_id": manager_id, "timestamp": str(now())})


class ChangePasswordView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        if user.user_type == 1:
            serializer = GetOwnerUserSerializer(user)
        elif user.user_type == 2:
            serializer = GetManagerUserSerializer(user)
        else:
            return Response({"error": "Invalid user type."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def patch(self, request):
        # Access the current authenticated user
        user = request.user

        # Serialize the user data and validate the request data

        if user.user_type == 1:
            serializer = GetOwnerUserSerializer(user, data=request.data, partial=True)
        elif user.user_type == 2:
            serializer = GetManagerUserSerializer(user, data=request.data, partial=True)
        else:
            return Response({"error": "Invalid user type."}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()  # Save the updated data
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeActiveStatusManagerView(ManagerOwnershipMixin, APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk):
        manager, error_response = self.get_manager(request, pk)
        if error_response:
            return error_response

        if not manager.is_confirmed:
            return Response({
                "detail": "Manager must confirm their account before active status can be changed."
            }, status=status.HTTP_400_BAD_REQUEST)

        manager.is_active = not manager.is_active
        manager.save()

        return Response({
            "message": "Manager's active status updated successfully.",
            "is_active": manager.is_active
        }, status=status.HTTP_200_OK)

    def get(self, request, pk):
        manager, error_response = self.get_manager(request, pk)
        if error_response:
            return error_response

        return Response({
            "message": "Manager's current status:",
            "is_active": manager.is_active
        }, status=status.HTTP_200_OK)
