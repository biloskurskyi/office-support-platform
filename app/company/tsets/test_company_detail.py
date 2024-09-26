from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from core.models import Company, User
from user.tests.test_user_api import UserApiTestsBase


class CompanyDetailApiTests(UserApiTestsBase, TestCase):
    """Tests for the Company Detail API."""

    def add_company_to_db(self, user):
        company = Company.objects.create(
            name='Test company',
            legal_name='Test legal name',
            description="Test description",
            website="https://www.testwebsite.com/",
            owner=user
        )
        return company

    def get_company_url(self, company_id):
        """Helper method to get the company detail URL."""
        return reverse('company:company-detail', args=[company_id])

    @patch('django.core.mail.send_mail')
    def test_get_company_success(self, mock_send_mail):
        """Ensure a user can get company details."""
        mock_send_mail.return_value = 1
        self.register_user()

        user = User.objects.get(email=self.user_data['email'])
        user.is_active = True
        user.save()

        token = self.get_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        company = self.add_company_to_db(user)
        response = self.client.get(self.get_company_url(company.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('name', response.data)
        self.assertEqual(response.data['name'], company.name)
