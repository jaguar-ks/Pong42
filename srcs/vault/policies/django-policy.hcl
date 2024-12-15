path "kv/django" {
    capabilities = ["read", "list"]
}

path "database/creds/postgres-role" {
    capabilities = ["read"]
}

path "sys/leases/renew" {
    capabilities = ["update"]
}

path "sys/leases/revoke" {
    capabilities = ["update"]
}
