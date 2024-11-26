from rest_framework import views, permissions
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from .serializers import OauthAuthorizeSerializer, OauthCallBackSerializer
from apps.utils import sing_in_response
from .docs import OAUTH_CALLBACK_SCHEMA, OAUTH_AUTHORIZE_SCHEMA


@extend_schema(**OAUTH_CALLBACK_SCHEMA)
class OauthCallbackView(views.APIView):
    serializer_class = OauthCallBackSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, provider):
        serializer = self.serializer_class(
            data=request.data, context={"provider": provider}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = Response(
            {"message": "signed-in successfully", "user": serializer.data["user"]}
        )
        sing_in_response(response, serializer.data["token"])
        return response


@extend_schema(**OAUTH_AUTHORIZE_SCHEMA)
class OauthAuthorizeView(views.APIView):
    serializer_class = OauthAuthorizeSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, provider):
        serializer = self.serializer_class({}, context={"provider": provider})
        return Response(serializer.data)
