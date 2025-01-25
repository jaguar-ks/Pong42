#!/bin/sh

set -e

apk add jq curl

# File to store unseal keys and root token
VAULT_KEYS_FILE="/vault/init/vault_keys.txt"
VAULT_SERVER_ADDRESS="http://127.0.0.1:8200"
VAULT_READY_TIMEOUT=30  # Time (in seconds) to wait for Vault to be ready

# Start the Vault server in the background
vault server -config=/vault/config/vault.hcl &
VAULT_PID=$!

init_vault() {
    READY=$(set +e; vault operator init -status &>/dev/null; echo $?)
    if [ $READY -eq 0 ]; then
        return
    fi
    INIT_OUT=$(vault operator init -format=json)
    # Extract and store unseal keys and root token
    UNSEAL_KEY_1=$(echo $INIT_OUT | jq -r '.unseal_keys_b64[0]')
    UNSEAL_KEY_2=$(echo $INIT_OUT | jq -r '.unseal_keys_b64[1]')
    UNSEAL_KEY_3=$(echo $INIT_OUT | jq -r '.unseal_keys_b64[2]')
    ROOT_TOKEN=$(echo $INIT_OUT | jq -r '.root_token')
    mkdir -p /vault/init
    cat << EOF > $VAULT_KEYS_FILE
UNSEAL_KEY_1=$UNSEAL_KEY_1
UNSEAL_KEY_2=$UNSEAL_KEY_2
UNSEAL_KEY_3=$UNSEAL_KEY_3
ROOT_TOKEN=$ROOT_TOKEN
EOF
    chmod 600 $VAULT_KEYS_FILE
}

vault_login() {
    if [ -e $VAULT_KEYS_FILE ]; then
        source $VAULT_KEYS_FILE
        SEALED=$(vault status | grep "Sealed" | awk '{print $2}')
        if "$SEALED" == "false"; then
            vault operator unseal $UNSEAL_KEY_1
            vault operator unseal $UNSEAL_KEY_2
            vault operator unseal $UNSEAL_KEY_3
        fi
        vault login $ROOT_TOKEN
        echo "[INFO] : logged successfully and vault is ready to use"
    else
        echo "[INFO] : vault is not initialized"
        # init_vault
    fi
}

echo "Waiting for Vault to be ready..."
while vault status | grep -qs 'connection refused'; do
  sleep 5
done

if ! curl -s "${VAULT_SERVER_ADDRESS}/v1/sys/health" | jq ".sealed == true"; then
    echo "[Error] : Vault did not become ready within $VAULT_READY_TIMEOUT seconds."
    kill $VAULT_PID
    exit 1
fi

READY=$(set +e; vault operator init -status &>/dev/null; echo $?)

if [ $READY -eq 0 ]; then
    echo "[INFO] : vault is already initialized"
    vault_login
else
    init_vault
    vault_login
fi

/bin/sh -c /vault/tools/secrets_init.sh

wait $VAULT_PID
