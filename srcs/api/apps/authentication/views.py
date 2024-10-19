from rest_framework import generics, permissions, views
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from . import serializers

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

class   Enable2FaView(TwoFaBaseView):
    context = {'action': 'enable'}

class   Disable2FaView(TwoFaBaseView):
    context = {'action': 'disable'}

class   SignUpView(generics.CreateAPIView):
    serializer_class = serializers.SignUpSerializer
    permission_classes = [permissions.AllowAny]

class   SignInView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response.set_cookie(
                key='refresh_token',
                value=response.data['refresh'],
                httponly=True,  # Makes the cookie inaccessible to JavaScript
                # samesite='Lax',  # Provides some CSRF protection
                # secure=True,  # Ensures the cookie is only sent over HTTPS
                # max_age=3600 * 24 * 14  # 14 days
            )
            response.set_cookie(
                key='access_token',
                value=response.data['access'],
                httponly=True,
                # samesite='Lax',
                # secure=True,
                # max_age=3600  # 1 hour
            )
            response.data = {
                'detail': 'Successfully signed in.',
            }
        return response

class   SignOutView(views.APIView):
    def post(self, request):
        res = Response({'detail': 'Signed out successfully'})
        res.delete_cookie('refresh_token')
        res.delete_cookie('access_token')
        return res