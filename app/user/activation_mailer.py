import logging
from typing import Optional

from django.conf import settings
from django.core.mail import send_mail
from itsdangerous import URLSafeTimedSerializer

from core.models import User

logger = logging.getLogger(__name__)


class ActivationMailer:
    """Builds the activation link and sends the activation e-mail for a user."""

    @staticmethod
    def make_token(user_id: int) -> str:
        return URLSafeTimedSerializer(settings.SECRET_KEY).dumps({"user_id": user_id})

    @classmethod
    def send(cls, user: User, temporary_password: Optional[str] = None) -> str:
        """Sends the e-mail and returns a human-readable delivery status."""
        link = f'{settings.FRONTEND_BASE_URL}/activate-user/{cls.make_token(user.id)}/'
        if temporary_password is None:
            subject = 'Activate your account'
            message = (
                f"Вітаємо, {user.name}!\n\n"
                f"Для активації вашого акаунта, будь ласка, перейдіть за наступним посиланням:\n{link}\n\n"
                f"Якщо ви не створювали обліковий запис, просто проігноруйте цей лист.\n\n"
            )
        else:
            subject = 'Manager Account Has Been Created. Activate Your Account!'
            message = (
                f"Вітаємо, {user.name}!\n\n"
                f"Ваш обліковий запис було створено. Ось ваш тимчасовий пароль: {temporary_password}\n"
                f"Для активації вашого акаунта перейдіть за наступним посиланням:\n{link}\n\n"
                f"Не забудьте змінити свій пароль після входу."
            )
        try:
            send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email], fail_silently=False)
        except Exception as e:  # SMTP errors are reported to the caller, never raised
            logger.warning('Activation e-mail to user %s failed: %s', user.id, e)
            return f'Error sending email: {e}'
        return 'Email sent successfully.'
