#!/bin/sh

if vault secrets list | grep -q "^kv/"; then
    echo "[INFO] : KV secrets engine is already enabled at 'kv/'"
else
    echo "[INFO] : KV secrets engine is not enabled at 'kv/'. Enabling now..."
    vault secrets enable kv
fi

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
        GITHUB_OAUTH_REDIRECT_URI="${GITHUB_OAUTH_REDIRECT_URI}"
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


vault auth enable approle || echo "[INFO]: AppRole already enabled."

create_policy django
create_approle django

create_django_secrets
