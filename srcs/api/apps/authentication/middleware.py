from django.utils.deprecation import MiddlewareMixin


class   CookieToAuthorizationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if 'access' in request.COOKIES:
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {request.COOKIES['access']}'
