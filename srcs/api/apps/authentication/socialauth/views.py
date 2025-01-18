from rest_framework import views, permissions
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from django.shortcuts import redirect

from .serializers import OauthProvidersUrls, OauthCallBackSerializer
from apps.utils import sing_in_response
from .docs import OAUTH_CALLBACK_SCHEMA, OAUTH_AUTHORIZE_SCHEMA


@extend_schema(**OAUTH_CALLBACK_SCHEMA)
class OauthCallbackView(views.APIView):
    serializer_class = OauthCallBackSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, provider):
        serializer = self.serializer_class(
            data=request.GET, context={"provider": provider}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user = serializer.data["user"]
        if user['two_fa_enabled'] == True:
            return redirect(f'http://localhost:3000/auth/signin?otp_required=true&user_id={user["id"]}')
            pass
        response = redirect("http://localhost:3000/users/home")
        sing_in_response(response, serializer.data["token"])
        return response


@extend_schema(**OAUTH_AUTHORIZE_SCHEMA)
class OauthAuthorizeListView(views.APIView):
    serializer_class = OauthProvidersUrls
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        serializer = self.serializer_class({})
        return Response(serializer.data)
