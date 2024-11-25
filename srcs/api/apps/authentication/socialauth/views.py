from rest_framework import views, permissions
from rest_framework.response import Response
from .serializers import OauthAuthorizeSerializer, OauthCallBackSerializer

class   OauthCallbackView(views.APIView):
    serializer_class = OauthCallBackSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, provider):
        serializer = self.serializer_class(
            data=request.GET,
            context={'provider': provider}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        token = serializer.data['token']
        return Response({
            'message': 'signed-in successfully',
            'user': serializer.data['user']
        })

class   OauthAuthorizeView(views.APIView):
    serializer_class = OauthAuthorizeSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, provider):
        serializer = self.serializer_class({}, context={'provider': provider})
        return Response(serializer.data)
