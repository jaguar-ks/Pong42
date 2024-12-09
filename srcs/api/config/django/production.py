from .base import *

DATABASES = {"default": env.db_url("DATABASE_URL")}
