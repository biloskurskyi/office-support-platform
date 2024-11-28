from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from company.tests.test_company_api import CompanyApiTestBase
from core.models import Company, Office, User
from user.tests.test_user_api import UserApiTestsBase


class OfficeApiOwnerTests(CompanyApiTestBase, TestCase):
    """Tests for the Office API for owners."""

    def setUp(self):
        super().setUp()
        self.office_url = reverse('office:office')

    def add_office(self, **kwargs):
        """Helper method to add office."""
        data = {
            "address": "123 Test St",
            "city": "Test city",
            "country": "Test country",
            "postal_code": "1234",
            "phone_number": "+1234567890",
            "company": self.company.id
        }

        data.update(kwargs)
        return self.client.post(self.office_url, data, format='json')

    def get_offices(self):
        """Helper method to get all offices."""
        return self.client.get(self.office_url)


class OfficeApiTest(OfficeApiOwnerTests):
    # @patch('django.core.mail.send_mail')
    # def test_add_office_success(self, mock_send_activation_email):
    #     """Ensure an owner user can add an office."""
    #     mock_send_activation_email.return_value = None
    #     self.register_user()
    #
    #     user = User.objects.get(email=self.user_data['email'])
    #     user.is_active = True
    #     user.save()
    #
    #     self.get_token()
    #     self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token()}')
    #
    #     response_office = self.add_company()
    #     self.assertEqual(response_office.status_code, status.HTTP_201_CREATED)
    #     self.company = Company.objects.get(name="Test company")
    #
    #     response = self.add_office()
    #
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertIn('message', response.data)
    #     self.assertEqual(response.data['message'], 'Office created successfully.')

    @patch('django.core.mail.send_mail')
    def test_get_all_offices(self, mock_send_mail):
        """Test that all offices are returned to the owner user."""
        mock_send_mail.return_value = 1
        self.register_user()

        user = User.objects.get(email=self.user_data['email'])
        user.is_active = True
        user.save()

        token = self.get_token()

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        response = self.client.get(self.office_url, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
