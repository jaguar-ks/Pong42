from drf_spectacular.utils import OpenApiResponse, OpenApiRequest, OpenApiParameter
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


SIGN_UP_SCHEMA = {
    "summary": "account registration",
    "description": "Create a new account for the user",
    "request": serializers.SignUpSerializer,
    "responses": {
        status.HTTP_201_CREATED: OpenApiResponse(
            description="account created successfully",
            response=serializers.SignUpSerializer,
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            description="Bad request",
            response={
                "type": "object",
                "properties": {
                    "email": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        },
                    },
                    "password": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        },
                    },
                },
            },
        ),
    },
    "tags": ["AUTH"],
}


SIGN_IN_SCHEMA = {
    "summary": "sign in",
    "description": "sing in the user by setting a jwt token in cookies",
    "request": serializers.SignUpSerializer,
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
                    "username": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "example": "This field is required.",
                        },
                    },
                    "password": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "example": "This field is required.",
                        },
                    },
                    "otp_code": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "example": "This field is required.",
                        },
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
                        "example": "email address is not verified",
                    },
                },
            },
        ),
    },
    "tags": ["AUTH"],
}

SIGN_OUT_SCHEMA = {
    "summary": "sign out",
    "description": "sign out the user by blacklisting the token and deleting the token from cookies",
    "responses": {
        status.HTTP_200_OK: OpenApiResponse(
            description="signed out successfully",
            response={
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "example": "Signed out successfully",
                    },
                },
            },
        ),
        "401": OpenApiResponse(
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
    },
    "tags": ["AUTH"],
}


TEST_AUTH_SCHEMA = {
    "summary": "verify authentication",
    "description": "verify the authentication of the user",
    "responses": {
        status.HTTP_200_OK: OpenApiResponse(
            description="authenticated successfully",
            response={
                "type": "object",
                "properties": {
                    "success": {
                        "type": "boolean",
                        "example": True,
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
    },
    "tags": ["AUTH"],
}

EMAIL_VERIFY_SCHEMA = {
    "summary": "verify email",
    "description": "verify the email address of the user",
    "parameters": [
        OpenApiParameter(
            name="token",
            description="the token sent to the user email",
            required=True,
            location="query",
        ),
        OpenApiParameter(
            name="uid",
            description="the user id",
            required=True,
            location="query",
        ),
    ],
    "responses": {
        status.HTTP_200_OK: OpenApiResponse(
            description="email verified successfully",
            response={
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "example": "Email verified successfully",
                    },
                },
            },
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            description="Bad request",
            response={
                "type": "object",
                "properties": {
                    "token": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        },
                    },
                    "uid": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        },
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
                        "example": "Link is invalid or expired",
                    },
                },
            },
        ),
    },
    "tags": ["AUTH"],
}


RESEND_VERIFY_EMAIL_SCHEMA = {
    "summary": "resend verification email",
    "description": "resend the verification email to the user",
    "request": serializers.ResendVerifyEmailSerializer,
    "responses": {
        status.HTTP_200_OK: serializers.ResendVerifyEmailSerializer,
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            description="Bad request",
            response={
                "type": "object",
                "properties": {
                    "email": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        },
                        "example": ["no user found with this email"],
                    },
                    "detail": {
                        "type": "string",
                        "example": "Failed to send verification",
                    },
                },
            },
        ),
    },
    "tags": ["AUTH"],
}
