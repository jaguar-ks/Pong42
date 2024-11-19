from rest_framework import generics, permissions, views
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainSlidingView
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample, OpenApiTypes
from rest_framework_simplejwt.tokens import SlidingToken
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.conf import settings

from . import serializers
from apps.utils import validate_token_and_uid

class   TwoFaBaseView(generics.GenericAPIView):
    serializer_class = serializers.TwoFASerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        self.context['request'] = request
        serializer = self.serializer_class(
            data=request.data,
            context=self.context,
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


@extend_schema(
    summary="Enable Two-Factor Authentication",
    description="Enable 2FA for the authenticated user by verifying the OTP and activating 2FA.",
    request=serializers.TwoFASerializer,
    responses={
        200: OpenApiResponse(
            response=OpenApiTypes.OBJECT,
            examples=[
                OpenApiExample(
                    name="Success Example",
                    value={"detail": "2FA enabled successfully"},
                    response_only=True
                )
            ]
        )
    }
)
class Enable2FaView(TwoFaBaseView):
    context = {'action': 'enable'}


@extend_schema(
    summary="Disable Two-Factor Authentication",
    description="Disable 2FA for the authenticated user by verifying the OTP and deactivating 2FA.",
    request=serializers.TwoFASerializer,
    responses={
        200: OpenApiResponse(
            response=OpenApiTypes.OBJECT,
            examples=[
                OpenApiExample(
                    name="Success Example",
                    value={"detail": "2FA disabled successfully"},
                    response_only=True
                )
            ]
        )
    }
)
class   Disable2FaView(TwoFaBaseView):
    context = {'action': 'disable'}



@extend_schema(
    summary="User Sign-Up",
    description="Allows a new user to sign up by providing the necessary information.",
)
class   SignUpView(generics.CreateAPIView):
    serializer_class = serializers.SignUpSerializer
    permission_classes = [permissions.AllowAny]

class   SignInView(TokenObtainSlidingView):
    @extend_schema(
        summary="User Sign-In",
        description="Signs In user by set jwt tokens [access_token, refresh_token] in cookies",
        responses={
            200: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        name="Success Example",
                        value={"detail": "Signed In successfully"},
                        response_only=True
                    )
                ]
            )
        }
    )
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response.set_cookie(
                key=settings.AUTH_TOKEN_NAME,
                value=response.data['token'],
                httponly=True,  # Makes the cookie inaccessible to JavaScript
                # samesite='Lax',  # Provides some CSRF protection
                # secure=True,  # Ensures the cookie is only sent over HTTPS
                # max_age=3600 * 24 * 14  # 14 days
            )
            response.data = {
                'detail': 'Successfully signed in.',
            }
        return response

class SignOutView(views.APIView):

    @extend_schema(
        summary="User Sign-Out",
        description="Signs out the user by deleting the refresh and access token cookies.",
        request=None,  # No request body required
        responses={
            200: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        name="Success Example",
                        value={"detail": "Signed out successfully"},
                        response_only=True
                    )
                ]
            )
        }
    )
    def post(self, request):
        res = Response({'detail': 'Signed out successfully'})
        token = SlidingToken(request.COOKIES[settings.AUTH_TOKEN_NAME])
        token.blacklist()
        res.delete_cookie('token')
        return res

class   EmailVerifyView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uid, token):
        try:
            user = validate_token_and_uid(uid=uid,token=token)
            if user:
                user.is_email_verified = True
                user.save()
                return Response({'detail': 'email verified successfully'})
        except:
            pass

        return Response({'detail': 'invalid verification link'})


class   EmailSignInView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uid, token):
        user = validate_token_and_uid(uid=uid, token=token)
        access_token = SlidingToken.for_user(user=user)
        res = Response({"detail": "Signed In successfully"})
        res.set_cookie(
            key=settings.AUTH_TOKEN_NAME,
            value=access_token
        )
        return res



class   SendEmailView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.SendEmailSerializer
