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
        self.user_data = {
            'name': 'testuser',
            'surname': 'testsurname',
            'password': 'Testpassword123',
            'email': 'testuser@test.com',
            'user_type': 1
        }

    def register_user(self, **kwargs):
        """Helper method to register a user."""
        data = self.user_data.copy()
        data.update(kwargs)
        return self.client.post(self.register_url, data, format='json')


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
