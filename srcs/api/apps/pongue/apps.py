from django.apps import AppConfig


class PongueConfig(AppConfig):
    name = "apps.pongue"

    def ready(self):
        import apps.pongue.signals
