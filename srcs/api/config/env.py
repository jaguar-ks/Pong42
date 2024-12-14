from pathlib import Path
import environ
import os
import hvac

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# env = environ.Env()

# environ.Env.read_env(BASE_DIR / ".env")

client = hvac.Client(url="http://vault:8200")

role_id = os.getenv("ROLE_ID")
secret_id = os.getenv("SECRET_ID")

# print(role_id, secret_id)

if not client.is_authenticated():
    client.auth.approle.login(
        role_id=role_id,
        secret_id=secret_id
    )

read_resp = client.secrets.kv.v1.read_secret(
    path="django",
    mount_point="kv",
)

# Example: Use the token to fetch secrets
class env:
    def __init__(self, key, default=None):
        self.key = key
        # pass

    def __new__(cls, key, default=None):
        if  key not in read_resp["data"]:
            return str(default)
        return str(read_resp["data"][key])
    
    def int(key, default=None):
        if  key not in read_resp["data"]:
            return int(default)
        return int(read_resp["data"][key])

    def bool(key, default=None):
        if  key not in read_resp["data"]:
            return bool(default)
        return bool(read_resp["data"][key])

    def env(key, default=None):
        if  key not in read_resp["data"]:
            return str(default)
        return str(read_resp["data"][key])


