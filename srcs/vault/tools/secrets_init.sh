#! /bin/sh

activate_secrets_engine() {
    service=$1
    if ! vault secrets list | grep -q "^${service}/"; then
        echo "[INFO] : Enabling secrets engine '${service}'..."
        vault secrets enable ${service}
    else
        echo "[INFO] : Secrets engine '${service}' is already enabled."
    fi
}

create_policy() {
    service=$1
    if ! vault policy list | grep -q "^${service}$"; then
        echo "[INFO] : Creating policy for ${service}..."
        vault policy write ${service} /vault/policies/${service}-policy.hcl
    else
        echo "[INFO] : Policy for ${service} already exists."
    fi
}

create_django_secrets() {
    vault kv put kv/django \
        DJANGO_SECRET_KEY="${DJANGO_SECRET_KEY}" \
        EMAIL_HOST_USER="${EMAIL_HOST_USER}" \
        EMAIL_HOST_PASSWORD="${EMAIL_HOST_PASSWORD}" \
        WEBSITE_NAME="${WEBSITE_NAME}" \
        DOMAIN_NAME="${DOMAIN_NAME}" \
        OAUTH_42_CLIENT_ID="${OAUTH_42_CLIENT_ID}" \
        OAUTH_42_CLIENT_SECRET="${OAUTH_42_CLIENT_SECRET}" \
        OAUTH_42_REDIRECT_URI="${OAUTH_42_REDIRECT_URI}" \
        GOOGLE_OAUTH_CLIENT_ID="${GOOGLE_OAUTH_CLIENT_ID}" \
        GOOGLE_OAUTH_CLIENT_SECRET="${GOOGLE_OAUTH_CLIENT_SECRET}" \
        GOOGLE_OAUTH_REDIRECT_URI="${GOOGLE_OAUTH_REDIRECT_URI}" \
        GITHUB_OAUTH_CLIENT_ID="${GITHUB_OAUTH_CLIENT_ID}" \
        GITHUB_OAUTH_CLIENT_SECRET="${GITHUB_OAUTH_CLIENT_SECRET}" \
        GITHUB_OAUTH_REDIRECT_URI="${GITHUB_OAUTH_REDIRECT_URI}" \
        DB_NAME="${DB_NAME}" \
        POSTGRES_DB="${POSTGRES_DB}" \
        FRONT_BASE_URL="${FRONT_BASE_URL}"
}

create_approle() {
    service=$1
    if ! vault read auth/approle/role/${service}-role; then
        echo "[INFO] : Creating AppRole for ${service}..."
        vault write auth/approle/role/${service}-role \
            policies=${service} \
            secret_id_ttl=0 \
            token_num_uses=0 \
            token_ttl=0 \
            token_max_ttl=0
        # Retrieve Role ID and Secret ID
        echo "[INFO]: Retrieving Role ID and Secret ID"
        ROLE_ID=$(vault read -format=json auth/approle/role/${service}-role/role-id | jq -r '.data.role_id')
        SECRET_ID=$(vault write -f -format=json auth/approle/role/${service}-role/secret-id | jq -r '.data.secret_id')
        echo "[INFO] : Storing Role ID and Secret ID in /vault/init/${service}-role"
        cat << EOF > /vault/init/${service}-cred.json
{
    "role_id": "${ROLE_ID}",
    "secret_id": "${SECRET_ID}"
}
EOF
    else
        echo "[INFO] : AppRole for ${service} already exists."
    fi
}

config_db () {
    vault write database/config/${DB_NAME} \
        plugin_name=postgresql-database-plugin \
        allowed_roles="postgres-role" \
        connection_url="postgresql://{{username}}:{{password}}@${POSTGRES_DB}:5432/${DB_NAME}?sslmode=disable" \
        username="${POSTGRES_USER}" \
        password="${POSTGRES_PASSWORD}"
    
    vault write database/roles/postgres-role \
        db_name=${DB_NAME} \
        creation_statements="
            CREATE ROLE \"{{name}}\" WITH LOGIN PASSWORD '{{password}}';
            GRANT USAGE ON SCHEMA public TO \"{{name}}\"; 
            GRANT CREATE ON SCHEMA public TO \"{{name}}\"; 
            GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"{{name}}\"; 
            GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO \"{{name}}\"; 
            ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO \"{{name}}\"; 
            ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO \"{{name}}\";" \
        default_ttl="0" \
        max_ttl="0"
}

activate_secrets_engine kv
activate_secrets_engine database

vault auth enable approle || echo "[INFO]: AppRole already enabled."

create_policy django
create_approle django

create_django_secrets

config_db
