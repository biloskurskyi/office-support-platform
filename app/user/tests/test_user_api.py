from unittest.mock import patch

from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from core.models import User


class UserApiTestsBase(TestCase):
    """Base class with common setup and helper methods."""

    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('user:register')
        self.login_url = reverse('user:login')
        self.logout_url = reverse('user:logout')
        self.user_data = {
            'name': 'testuser',
            'surname': 'testsurname',
            'password': 'Testpassword123',
            'email': 'testuser@test.com',
            'user_type': 1,
            'is_confirmed': 'true'
        }

    def register_user(self, **kwargs):
        """Helper method to register a user."""
        data = self.user_data.copy()
        data.update(kwargs)
        return self.client.post(self.register_url, data, format='json')

    def login_user(self, **kwargs):
        """Helper method to log in a user."""
        data = {
            'email': self.user_data['email'],
            'password': self.user_data['password'],
        }
        data.update(kwargs)
        response = self.client.post(self.login_url, data, format='json')
        return response

    def get_token(self):
        """Helper method to get token."""
        response = self.login_user()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data['jwt']


class UserApiTests(UserApiTestsBase):
    @patch('django.core.mail.send_mail')
    def test_register_user_success(self, mock_send_mail):
        """
        Ensure we can create a new user.
        """
        mock_send_mail.return_value = 1
        response = self.register_user()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().name, 'testuser')

    @patch('django.core.mail.send_mail')
    def test_register_user_invalid_data(self, mock_send_mail):
        """
        Ensure we cannot create a new user with invalid data.
        """
        mock_send_mail.return_value = None  # No email sending on invalid data
        response = self.register_user(name='')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 0)
        mock_send_mail.assert_not_called()

    @patch('django.core.mail.send_mail')
    def test_login_user_success(self, mock_send_mail):
        """
        Ensure we can log in user with valid credentials.
        """
        response_register = self.register_user()
        self.assertEqual(response_register.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(email=self.user_data['email'])
        user.is_active = True
        user.save()

        response_login = self.login_user()
        self.assertEqual(response_login.status_code, status.HTTP_200_OK)

    @patch('django.core.mail.send_mail')
    def test_login_user_not_success(self, mock_send_mail):
        """
        Ensure we can not log in user with wrong password.
        """
        response_register = self.register_user()
        self.assertEqual(response_register.status_code, status.HTTP_201_CREATED)

        response_login = self.login_user(password='12345678')
        self.assertEqual(response_login.status_code, status.HTTP_403_FORBIDDEN)

    @patch('django.core.mail.send_mail')
    def test_logout_user_success(self, mock_send_activation_email):
        """
        Ensure we can logout user with valid token
        """
        mock_send_activation_email.return_value = None
        self.register_user()

        user = User.objects.get(email=self.user_data['email'])
        user.is_active = True
        user.save()

        token = self.get_token()

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.post(self.logout_url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'success')

    @patch('django.core.mail.send_mail')
    def test_logout_user_not_success(self, mock_send_activation_email):
        """
        Ensure we can not log out user with not valid token
        """
        mock_send_activation_email.return_value = None
        self.register_user()

        self.client.credentials(HTTP_AUTHORIZATION='Bearer randomtokenwhichisnotvalid')
        response = self.client.post(self.logout_url, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('detail', response.data)
        self.assertEqual(response.data['detail'], 'Invalid token')
