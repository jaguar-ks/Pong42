from django.utils.functional import SimpleLazyObject
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model

User = get_user_model()

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Authenticate token and get user
        token = self._authenticate(request)
        if token:
            user = self._get_user_from_access_token(token)
            # Set attributes on the request
            setattr(request, 'auth', token)
            setattr(request, '_user', SimpleLazyObject(lambda: user))
            setattr(request, 'is_authenticated_using_middleware', user is not None)

        response = self.get_response(request)

        # Update token if refreshed
        return self._update_token_if_refreshed(request, response)

    def _authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        refresh_token = request.COOKIES.get('refresh_token')

        if not access_token or not refresh_token:
            return None

        try:
            token = AccessToken(access_token)
            return token
        except TokenError:
            # If access token is invalid, try refreshing it
            try:
                refresh = RefreshToken(refresh_token)
                new_access_token = str(refresh.access_token)
                request.COOKIES['access_token'] = new_access_token
                # Set flag for refreshed token
                request.token_refreshed = True
                return refresh.access_token
            except TokenError:
                return None

    def _get_user_from_access_token(self, validated_token):
        try:
            user_id = validated_token['user_id']
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    def _update_token_if_refreshed(self, request, response):
        if getattr(request, 'token_refreshed', False):
            response.set_cookie(
                key='access_token',
                value=request.COOKIES['access_token'],
                httponly=True,
            )
        return response


from rest_framework.authentication import BaseAuthentication

class SessionJWTAuth(BaseAuthentication):

    def authenticate(self, request):
        # Avoid recursive call by directly using the attributes set by middleware
        if getattr(request, 'is_authenticated_using_middleware', False):
            return request._user, request.auth
        return None
    
    def authenticate_header(self, request):
        return "Set-Cookie: access_token"
