from django.apps import AppConfig

class   AuthenticationAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authentication'
    
    def ready(self) -> None:
        import apps.authentication.signals
        from .openapi_extensions import OpenApiAuthenticationExtension