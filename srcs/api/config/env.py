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

print(role_id, secret_id)

if not client.is_authenticated():
    client.auth.approle.login(
        role_id=role_id,
        secret_id=secret_id
    )

try:
    read_resp = client.secrets.kv.v1.read_secret(
        path="django",
        mount_point="kv",
    )
except hvac.exceptions.Forbidden as e:
    print(e.errors, e.url, sep="\n")
    read_resp = None

# Example: Use the token to fetch secrets
def env(key):
    return read_resp["data"][key]
