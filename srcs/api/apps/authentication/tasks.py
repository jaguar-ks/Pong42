from django.conf import settings
from django.urls import reverse
from urllib.parse import urlencode

from apps.utils import generate_token_and_uid, send_template_email

def send_verification_email(user):
    """
    Task to send a verification email to the user.

    Args:
        user (User): User instance to whom the email is sent.
    """
    token, uid = generate_token_and_uid(user)

    verification_url = f"{settings.WEBSITE_DOMAIN_NAME}/auth/verifyEmail?{urlencode({'uid': uid, 'token': token})}"

    context = {
        "website_name": settings.WEBSITE_NAME,
        "user": user,
        "verification_url": verification_url,
    }

    return send_template_email(
        "Verify Your Email Address", "emails/verify_email.html", context, user.email
    )
