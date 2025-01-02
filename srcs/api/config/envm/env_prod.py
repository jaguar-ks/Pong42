from pathlib import Path
import environ
import os
import hvac

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class ENV:
    client = hvac.Client(url="http://vault:8200")
    
    role_id = os.getenv("ROLE_ID")
    secret_id = os.getenv("SECRET_ID")
    
    def __init__(self):
        if not self.client.is_authenticated():
            self.client.auth.approle.login(
                role_id=self.role_id,
                secret_id=self.secret_id
            )
        self.secrets = self.client.secrets.kv.v1.read_secret(
            path="django",
            mount_point="kv",
        )
        self.db_creds = self.client.secrets.database.generate_credentials(name="postgres-role")

    def db_user(self):
        return str(self.db_creds["data"]["username"])
    
    def db_password(self):
        return str(self.db_creds["data"]["password"])
    
    def int(self, key, default=None):
        if key not in self.secrets["data"] and default != None:
            return int(default)
        return int(self.secrets["data"][key])
    
    def bool(self, key, default=None):
        if key not in self.secrets["data"] and default != None:
            return bool(default)
        return bool(self.secrets["data"][key])
    
    def __call__(self, key, default=None):
        if key not in self.secrets["data"] and default != None:
            return str(default)
        return str(self.secrets["data"][key])

env = ENV()
