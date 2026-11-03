from unittest.mock import patch

from django.core import mail
from django.test import TestCase, override_settings

from core.models import User, UserType
from user.activation_mailer import ActivationMailer


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class ActivationMailerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='o@example.com', password='pass12345', name='Ola', surname='S', user_type=UserType.OWNER,
        )

    def test_sends_activation_link(self):
        self.assertEqual(ActivationMailer.send(self.user), 'Email sent successfully.')
        self.assertIn('/activate-user/', mail.outbox[0].body)

    def test_manager_mail_contains_temporary_password(self):
        ActivationMailer.send(self.user, temporary_password='Tmp123')
        self.assertIn('Tmp123', mail.outbox[0].body)

    def test_smtp_failure_is_reported_not_raised(self):
        with patch('user.activation_mailer.send_mail', side_effect=OSError('smtp down')):
            self.assertIn('smtp down', ActivationMailer.send(self.user))
