from rest_framework import generics, permissions, views
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainSlidingView
from rest_framework_simplejwt.tokens import SlidingToken
from django.conf import settings
from drf_spectacular.utils import extend_schema

from . import serializers
from apps.utils import sing_in_response
from .docs import (
    ENABLE_2FA_SCHEMA,
    DISABLE_2FA_SCHEMA,
    SIGN_UP_SCHEMA,
    SIGN_IN_SCHEMA,
    SIGN_OUT_SCHEMA,
    EMAIL_VERIFY_SCHEMA,
    TEST_AUTH_SCHEMA,
    RESEND_VERIFY_EMAIL_SCHEMA,
)


class TwoFaBaseView(generics.GenericAPIView):
    serializer_class = serializers.TwoFASerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        self.context["request"] = request
        serializer = self.serializer_class(
            data=request.data,
            context=self.context,
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


@extend_schema(**ENABLE_2FA_SCHEMA)
class Enable2FaView(TwoFaBaseView):
    context = {"action": "enable"}


@extend_schema(**DISABLE_2FA_SCHEMA)
class Disable2FaView(TwoFaBaseView):
    context = {"action": "disable"}


@extend_schema(**SIGN_UP_SCHEMA)
class SignUpView(generics.CreateAPIView):
    serializer_class = serializers.SignUpSerializer
    permission_classes = [permissions.AllowAny]


@extend_schema(**SIGN_IN_SCHEMA)
class SignInView(TokenObtainSlidingView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            sing_in_response(response, response.data.pop("token"))
            response.data["message"] = "Successfully signed in."
        return response


@extend_schema(**SIGN_OUT_SCHEMA)
class SignOutView(views.APIView):

    def post(self, request):
        res = Response({"message": "Signed out successfully"})
        token = SlidingToken(request.COOKIES[settings.AUTH_TOKEN_NAME])
        token.blacklist()
        res.delete_cookie(settings.AUTH_TOKEN_NAME)
        return res


@extend_schema(**EMAIL_VERIFY_SCHEMA)
class EmailVerifyView(views.APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.EmailVerifySerializer

    def get(self, request):
        serializer = self.serializer_class(
            data=request.GET,
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)


@extend_schema(**TEST_AUTH_SCHEMA)
class TestAuthView(views.APIView):

    def get(self, request):
        return Response({"success": True})


@extend_schema(**RESEND_VERIFY_EMAIL_SCHEMA)
class ResendVerifyEmailView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.ResendVerifyEmailSerializer
