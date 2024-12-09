from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
import logging
from rest_framework.response import Response
from datetime import datetime

logger = logging.getLogger(__name__)


# Utility to generate token and UID for user
def generate_token_and_uid(user):
    """
    Generate token and UID for the user using Django's token generator.
    """

    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    return token, uid


def validate_token_and_uid(uid, token):
    try:
        id = urlsafe_base64_decode(uid).decode()
        user = get_user_model().objects.get(pk=id)
        # check token validity
        if default_token_generator.check_token(user, token):
            return user
    except:
        pass


# Utility to send an email
def send_template_email(subject, template_name, context, recipient_email):
    """
    Render an email template and send the email.

    Args:
        subject (str): The subject of the email.
        template_name (str): Path to the email template.
        context (dict): Context for rendering the template.
        recipient_email (str): Recipient email address.

    Returns:
        int: Number of successfully delivered emails (0 if failed).
    """
    try:
        email_html = render_to_string(template_name, context)
        email = EmailMessage(
            subject=subject,
            body=email_html,
            from_email=settings.EMAIL_HOST_USER,
            to=[recipient_email],
        )
        email.content_subtype = "html"  # Render as HTML
        return email.send()
    except Exception as e:
        logger.error(f"Failed to send email to {recipient_email}: {e}")
        return 0


def sing_in_response(response: Response, token):
    response.set_cookie(
        key=settings.AUTH_TOKEN_NAME,
        value=token,
        httponly=True,
        expires=int((datetime.now() + settings.AUTH_TOKEN_LIFETIME).timestamp()),
    )
