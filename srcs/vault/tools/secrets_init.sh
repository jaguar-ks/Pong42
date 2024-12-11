#!/bin/sh

if vault secrets list | grep -q "^kv/"; then
    echo "[INFO] : KV secrets engine is already enabled at 'kv/'"
else
    echo "[INFO] : KV secrets engine is not enabled at 'kv/'. Enabling now..."
    vault secrets enable kv
fi

create_django_secrets() {
    vault kv put kv/django \
        DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY} \
        EMAIL_HOST_USER=${EMAIL_HOST_USER} \
        EMAIL_HOST_PASSWORD=${EMAIL_HOST_PASSWORD} \
        WEBSITE_NAME=${WEBSITE_NAME} \
        DOMAIN_NAME=${DOMAIN_NAME} \
        OAUTH_42_CLIENT_ID=${OAUTH_42_CLIENT_ID} \
        OAUTH_42_CLIENT_SECRET=${OAUTH_42_CLIENT_SECRET} \
        OAUTH_42_REDIRECT_URI=${OAUTH_42_REDIRECT_URI} \
        GOOGLE_OAUTH_CLIENT_ID=${GOOGLE_OAUTH_CLIENT_ID} \
        GOOGLE_OAUTH_CLIENT_SECRET=${GOOGLE_OAUTH_CLIENT_SECRET} \
        GOOGLE_OAUTH_REDIRECT_URI=${GOOGLE_OAUTH_REDIRECT_URI} \
        GITHUB_OAUTH_CLIENT_ID=${GITHUB_OAUTH_CLIENT_ID} \
        GITHUB_OAUTH_CLIENT_SECRET=${GITHUB_OAUTH_CLIENT_SECRET} \
        GITHUB_OAUTH_REDIRECT_URI=${GITHUB_OAUTH_REDIRECT_URI}
}

vault auth enable approle || echo "[INFO]: AppRole already enabled."

create_django_secrets
