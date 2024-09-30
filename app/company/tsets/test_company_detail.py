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

    @patch('django.core.mail.send_mail')
    def test_delete_company_success(self, mock_send_mail):
        """Ensure a user can get company details."""
        mock_send_mail.return_value = 1
        self.register_user()

        user = User.objects.get(email=self.user_data['email'])
        user.is_active = True
        user.save()

        token = self.get_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        company = self.add_company_to_db(user)
        response = self.client.delete(self.get_company_url(company.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    @patch('django.core.mail.send_mail')
    def test_get_company_unauthorized(self, mock_send_mail):
        """Ensure a user cannot get details of a company they do not own."""
        mock_send_mail.return_value = 1

        self.register_user()
        user = User.objects.get(email=self.user_data['email'])
        user.is_active = True
        user.save()

        other_user = User.objects.create_user(
            email='otheruser@example.com',
            password='password123',
            user_type=User.OWNER_USER,
            is_active=True
        )

        token = self.get_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        company = self.add_company_to_db(other_user)

        response = self.client.get(self.get_company_url(company.id))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'],
                         'You do not have permission to access this company.')

    @patch('django.core.mail.send_mail')
    def test_patch_update_company_success(self, mock_send_mail):
        """Ensure an owner user can update company details."""
        mock_send_mail.return_value = 1
        self.register_user()

        user = User.objects.get(email=self.user_data['email'])
        user.is_active = True
        user.save()

        token = self.get_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        company = self.add_company_to_db(user)
        update_data = {'description': 'description update by patch'}

        response = self.client.patch(self.get_company_url(company.id), update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['description'], 'description update by patch')
        updated_company = Company.objects.get(id=company.id)
        self.assertEqual(updated_company.description, 'description update by patch')

    @patch('django.core.mail.send_mail')
    def test_update_company_success(self, mock_send_mail):
        """Ensure an owner user can update company details using PUT."""
        mock_send_mail.return_value = 1
        self.register_user()

        user = User.objects.get(email=self.user_data['email'])
        user.is_active = True
        user.save()

        token = self.get_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        company = self.add_company_to_db(user)

        update_data = {
            'name': 'Updated Company Name',
            'legal_name': 'TOV Updated Company Name',
            'description': 'Updated description for the company.',
        }

        response = self.client.put(self.get_company_url(company.id), update_data, format='json')

        if response.status_code != status.HTTP_200_OK:
            print(f"Response data: {response.data}")
            print(f"Response content: {response.content}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(response.data['name'], 'Updated Company Name')
        self.assertEqual(response.data['legal_name'], 'TOV Updated Company Name')
        self.assertEqual(response.data['description'], 'Updated description for the company.')

        updated_company = Company.objects.get(id=company.id)
        self.assertEqual(updated_company.name, 'Updated Company Name')
        self.assertEqual(updated_company.legal_name, 'TOV Updated Company Name')
        self.assertEqual(updated_company.description, 'Updated description for the company.')
