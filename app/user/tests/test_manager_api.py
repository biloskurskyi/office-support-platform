from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from core.models import Company, User


class CreateManagerViewTests(TestCase):
    """Tests for the CreateManagerView."""

    def setUp(self):
        self.client = APIClient()
        self.create_manager_url = reverse('user:register-manager')
        self.owner = User.objects.create_user(
            email='owner@test.com',
            password='Ownerpassword123',
            user_type=User.OWNER_USER,
            name='OwnerName',
            surname='OwnerSurname'
        )
        self.company = Company.objects.create(name='TestCompany', owner=self.owner)
        self.client.force_authenticate(user=self.owner)

    def create_manager(self, **kwargs):
        """Helper method to create a manager."""
        data = {
            'name': 'ManagerName',
            'surname': 'ManagerSurname',
            'email': 'manager@test.com',
            'info': 'Manager Info',
            'company': self.company.id,
        }
        data.update(kwargs)
        return self.client.post(self.create_manager_url, data, format='json')

    @patch('django.core.mail.send_mail')
    def test_create_manager_success(self, mock_send_mail):
        """
        Test successful creation of a manager by an owner.
        """
        mock_send_mail.return_value = 1
        response = self.create_manager()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
        manager = User.objects.get(email='manager@test.com')
        self.assertEqual(manager.user_type, User.MANAGER_USER)
        self.assertEqual(manager.company, str(self.company.id))

    @patch('django.core.mail.send_mail')
    def test_create_manager_not_owner(self, mock_send_mail):
        """
        Test that a non-owner cannot create a manager.
        """
        non_owner = User.objects.create_user(
            email='nonowner@test.com',
            password='Nonownerpassword123',
            user_type=User.MANAGER_USER,
            name='NonOwnerName',
            surname='NonOwnerSurname'
        )
        self.client.force_authenticate(user=non_owner)

        response = self.create_manager()

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(User.objects.count(), 2)
        mock_send_mail.assert_not_called()
