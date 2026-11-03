from django.test import TestCase
from rest_framework.test import APIClient

from core.models import Company, Office, User, UserType
from user.token_service import TokenService


class CompanyReportSmokeTests(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(
            email='owner@example.com', password='pass12345', name='O', surname='W',
            user_type=UserType.OWNER, is_active=True,
        )
        self.company = Company.objects.create(name='Acme', legal_name='Acme LLC', owner=self.owner)
        Office.objects.create(address='a', city='c', country='UA', phone_number='1', company=self.company)
        self.client = APIClient()

    def _get(self, user):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {TokenService.issue(user)}')
        return self.client.get('/api/company/pdf/')

    def test_owner_gets_pdf(self):
        User.objects.create_user(
            email='m@example.com', password='pass12345', name='M', surname='G',
            user_type=UserType.MANAGER, company=str(self.company.id),
        )
        response = self._get(self.owner)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/pdf')

    def test_manager_forbidden(self):
        manager = User.objects.create_user(
            email='m2@example.com', password='pass12345', name='M', surname='G',
            user_type=UserType.MANAGER, is_active=True,
        )
        self.assertEqual(self._get(manager).status_code, 403)
