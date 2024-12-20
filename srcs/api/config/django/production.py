from .base import *

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env('DB_NAME'),
        "USER": env.db_user(),
        "PASSWORD": env.db_password(),
        "HOST": env('POSTGRES_DB'),  # set in docker-compose.yml
        "PORT": 5432,  # default postgres port
    }
}

# channel layers
CHANNEL_LAYERS = {
    "default" : {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("redis", 6379)],
        },
    },
}
