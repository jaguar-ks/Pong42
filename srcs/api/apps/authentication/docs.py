from drf_spectacular.utils import (
    OpenApiResponse,
)
from rest_framework import status

from . import serializers

ENABLE_2FA_SCHEMA = {
    "summary": "Enable two factor authentication",
    "description": "Enable two factor authentication for the authenticated user",
    "request": serializers.TwoFASerializer,
    "responses": {
        200: OpenApiResponse(
            description="Successfully enabled two factor authentication",
            response={
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "example": "Two factor authentication enabled successfully",
                    },
                },
            },
        ),
        status.HTTP_401_UNAUTHORIZED: OpenApiResponse(
            description="Unauthorized",
            response={
                "type": "object",
                "properties": {
                    "detail": {
                        "type": "string",
                        "example": "Authentication credentials were not provided.",
                    },
                },
            },
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            description="Bad request",
            response={
                "type": "object",
                "properties": {
                    "otp_code": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        },
                        "example": ["Invalid OTP code!"],
                    },
                },
            },
        ),
    },
    "tags": ["2FA"],
}

DISABLE_2FA_SCHEMA = {
    **ENABLE_2FA_SCHEMA,
    "summary": "Disable two factor authentication",
    "description": "Disable two factor authentication for the authenticated user",
}

DISABLE_2FA_SCHEMA["responses"][200] = OpenApiResponse(
    description="Successfully disabled two factor authentication",
    response={
        "type": "object",
        "properties": {
            "message": {
                "type": "string",
                "example": "Two factor authentication disabled successfully",
            },
        },
    },
)
