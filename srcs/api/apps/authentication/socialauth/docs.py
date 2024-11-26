from drf_spectacular.utils import OpenApiResponse, OpenApiParameter
from rest_framework import status
from django.conf import settings

from . import serializers


OAUTH_PARAM = OpenApiParameter(
    name="provider",
    type=str,
    location=OpenApiParameter.QUERY,
    description="oauth provider name",
    required=True,
    enum=[provider for provider in settings.OAUTH_PROVIDERS_SETTINGS],
)


OAUTH_CALLBACK_SCHEMA = {
    "summary": "social auth callback",
    "description": "social auth callback view for oauth providers like google, facebook, etc.",
    "request": serializers.OauthCallBackSerializer,
    'parameters': [OAUTH_PARAM],
    "responses": {
        status.HTTP_200_OK: OpenApiResponse(
            description="singed in successfully",
            response={
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "example": "Successfully signed in.",
                    },
                    "user": {
                        "type": "object",
                        "example": serializers.UserSerializer().data,
                    },
                },
            },
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            description="Bad request",
            response={
                "type": "object",
                "properties": {
                    "code": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "example": "This field is required.",
                        },
                    },
                    "detail": {
                        "type": "string",
                        "example": "you oauth provider is didn't provide an email"
                    },
                },
            },
        ),
        status.HTTP_404_NOT_FOUND: OpenApiResponse(
            description="Not found",
            response={
                "type": "object",
                "properties": {
                    "detail": {
                        "type": "string",
                        "example": "provider not implemented",
                    },
                },
            },
        ),
    },
    "tags": ["SOCIAL AUTH"],
}


OAUTH_AUTHORIZE_SCHEMA = {
    'summary': 'social auth authorize',
    'description': 'get authorize url for oauth providers',
    'parameters': [OAUTH_PARAM],
    'responses': {
        status.HTTP_200_OK: OpenApiResponse(
            description='authorize url',
            response={
                'type': 'object',
                'properties': {
                    'authorize_url': {
                        'type': 'string',
                        'example': 'https://example.com/oauth/authorize?client_id=1234&redirect_uri=https://example.com/callback&scope=email',
                    }
                }
            }
        ),
        status.HTTP_404_NOT_FOUND: OpenApiResponse(
            description="Not found",
            response={
                "type": "object",
                "properties": {
                    "detail": {
                        "type": "string",
                        "example": "provider not implemented",
                    },
                },
            },
        ),
    },
    'tags': ['SOCIAL AUTH']
}
