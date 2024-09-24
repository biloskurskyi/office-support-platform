from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from core.models import Company, User
from user.tests.test_user_api import UserApiTestsBase


class CompanyApiTestBase(UserApiTestsBase, TestCase):
    """Test the features of the company(CompanyView) API."""

    def setUp(self):
        super().setUp()
        self.company_url = reverse('company:company')

    def add_company(self, **kwargs):
        """Helper method to add a company."""
        data = {
            "name": "Test company",
            "description": "Test description",
            "website": "https://www.testwebsite.com/"
        }
        data.update(kwargs)
        return self.client.post(self.company_url, data, format='json')

    def get_companies(self):
        """Helper method to get all companies."""
        return self.client.get(self.company_url)


class CompanyApiTest(CompanyApiTestBase):
    @patch('django.core.mail.send_mail')
    def test_get_all_companies(self, mock_send_mail):
        """Test that all companies are returned to the user."""
        mock_send_mail.return_value = 1
        self.register_user()

        user = User.objects.get(email=self.user_data['email'])
        user.is_active = True
        user.save()

        token = self.get_token()

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.company_url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('django.core.mail.send_mail')
    def test_add_company_success(self, mock_send_activation_email):
        """Ensure an owner user can add a company."""
        mock_send_activation_email.return_value = None
        self.register_user()

        user = User.objects.get(email=self.user_data['email'])
        user.is_active = True
        user.save()

        self.get_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token()}')
        response = self.add_company()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('name', response.data)
        self.assertEqual(response.data['name'], 'Test company')
