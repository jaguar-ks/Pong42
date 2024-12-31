import os

is_prod = os.getenv('PROD', 'false').lower() == 'true'

if is_prod:
    from .env_prod import *
else:
    from .env_dev import *
