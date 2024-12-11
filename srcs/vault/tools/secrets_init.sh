#!/bin/sh

if vault secrets list | grep -q "^kv/"; then
    echo "[INFO] : KV secrets engine is already enabled at 'kv/'"
else
    echo "[INFO] : KV secrets engine is not enabled at 'kv/'. Enabling now..."
    vault secrets enable kv
fi


