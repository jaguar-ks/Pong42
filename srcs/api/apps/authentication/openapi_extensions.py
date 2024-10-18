from drf_spectacular.extensions import OpenApiAuthenticationExtension

class SessionJWTAuthScheme(OpenApiAuthenticationExtension):
    target_class = 'apps.authentication.middleware.SessionJWTAuth'
    name = 'SessionJWTAuth'

    def get_security_definition(self, auto_schema):
        return {
            'type': 'http',
            'scheme': 'bearer',
            'bearerFormat': 'JWT',
        }
