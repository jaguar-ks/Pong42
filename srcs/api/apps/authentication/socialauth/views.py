from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from django.http import Http404
from rest_framework.response import Response
from django.conf import settings

from .serializers import (
    BaseOauthSerializer,
    FortyTwoOauthSerializer,
)

PROVIDERS_SETTINGS = settings.OAUTH_PROVIDERS_SETTINGS

class SocialAuthView(GenericAPIView):
    serializer_class = BaseOauthSerializer
    permission_classes = [AllowAny]

    OAUTH_PROVIDERS_SERIALIZERS = {
        '42': FortyTwoOauthSerializer,
    }

    def get(self, request, provider):
        serializer_class = self.OAUTH_PROVIDERS_SERIALIZERS.get(provider)
        config = PROVIDERS_SETTINGS.get(provider)
        if not config or not serializer_class:
            raise Http404(f"provider {provider} not implemented")
        serializer = serializer_class(
            data=request.GET,
            context={
                'request': request,
                'config': config,
                'provider': provider
            }
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = Response(data={
            'message': 'singed-in successfully',
            'user': serializer.data['user'],
        })

        response.set_cookie(
            key=settings.AUTH_TOKEN_NAME,
            value=serializer.data['token'],
            httponly=True,
        )
        return response
