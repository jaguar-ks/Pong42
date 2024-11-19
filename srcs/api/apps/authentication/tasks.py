from django.conf import settings
from django.urls import reverse

from apps.utils import generate_token_and_uid, send_template_email


# TODO: make send mail functions shared task with celery and redis

def send_verification_email(user, retries=1):
    """
    Task to send a verification email to the user.

    Args:
        user (User): User instance to whom the email is sent.
    """
    token, uid = generate_token_and_uid(user)

    verification_url = f"{settings.WEBSITE_DOMAIN_NAME}{reverse('verify_email', kwargs={'uid': uid, 'token': token})}"

    context = {
        'website_name': settings.WEBSITE_NAME,
        'user': user,
        'verification_url': verification_url,
    }

    return send_template_email('Verify Your Email Address', 'emails/verify_email.html', context, user.email)


def send_sign_in_email(self, user):
    """
    Task to send a sign-in email to the user.

    Args:
        user (User): User instance to whom the email is sent.
    """

    token, uid = generate_token_and_uid(user)

    sign_in_url = f"{settings.WEBSITE_DOMAIN_NAME}{reverse('email_sign_in', kwargs={'uid': uid, 'token': token})}"

    context = {
        'website_name': settings.WEBSITE_NAME,
        'user': user,
        'url': sign_in_url,
    }

    return send_template_email('Sign-In to your Account', 'emails/sign_in.html', context, user.email)
