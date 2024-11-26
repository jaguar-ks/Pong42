from config.env import env
from datetime import timedelta


AUTH_TOKEN_NAME = "access_token"

AUTH_TOKEN_LIFETIME = timedelta(days=2)

SIMPLE_JWT = {
    "SIGNING_KEY": env("DJANGO_SECRET_KEY"),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.SlidingToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",
    "JTI_CLAIM": "jti",
    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": AUTH_TOKEN_LIFETIME,
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "apps.authentication.serializers.ObtainSlidingTokenSerializer",
}
