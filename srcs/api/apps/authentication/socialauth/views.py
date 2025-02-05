from rest_framework import views, permissions, serializers
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from django.shortcuts import redirect
from django.core import signing
from .serializers import OauthProvidersUrls, OauthCallBackSerializer
from apps.utils import sing_in_response
from .docs import OAUTH_CALLBACK_SCHEMA, OAUTH_AUTHORIZE_SCHEMA
from django.conf import settings


@extend_schema(**OAUTH_CALLBACK_SCHEMA)
class OauthCallbackView(views.APIView):
    serializer_class = OauthCallBackSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, provider):
        try:
            serializer = self.serializer_class(
                data=request.GET, context={"provider": provider}
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            user = serializer.data["user"]
            if user['two_fa_enabled'] == True:
                token = signing.dumps({'user':user['id']}, settings.SECRET_KEY)
                rsp = redirect(settings.WEBSITE_DOMAIN_NAME + "/auth/signin?otp_required=true")
                rsp.set_cookie('tmp_token', token, httponly=True, max_age=60)
                return rsp
            response = redirect(settings.WEBSITE_DOMAIN_NAME + "/users/home")
            sing_in_response(response, serializer.data["token"])
            return response
        except serializers.ValidationError as e:
            return redirect(settings.WEBSITE_DOMAIN_NAME + f'/auth/signin?error={e}')


@extend_schema(**OAUTH_AUTHORIZE_SCHEMA)
class OauthAuthorizeListView(views.APIView):
    serializer_class = OauthProvidersUrls
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        serializer = self.serializer_class({})
        return Response(serializer.data)
