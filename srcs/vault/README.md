# HashiCorp Vault

## Overview

This directory contains the configuration files for HashiCorp Vault, a secrets management tool that provides secure storage and controlled access to sensitive data such as tokens, passwords, certificates, and encryption keys.

## Technologies

### HashiCorp Vault

HashiCorp Vault is an identity-based secrets and encryption management system. It allows you to:

- Securely store and manage sensitive data
- Generate dynamic secrets for various systems
- Provide encryption as a service
- Implement detailed access control policies
- Rotate credentials automatically

## Directory Structure

```
/srcs/vault/
├── config/              # Vault server configuration
│   └── vault.hcl        # HCL configuration file
├── dockerfile           # Docker configuration for Vault
├── init/                # Initialization scripts
└── scripts/             # Management scripts
```

## Configuration

### vault.hcl

The main configuration file that defines:
- Storage backend (file, Consul, etc.)
- Listener configuration (TCP, Unix socket)
- TLS settings
- UI enablement
- Telemetry settings

## How It Works

1. **Initialization**: Vault starts in a sealed state and requires initialization
2. **Unsealing**: Vault needs to be unsealed using unseal keys
3. **Authentication**: Users/systems authenticate to get tokens
4. **Authorization**: Policies control what authenticated users can access
5. **Secret Storage**: Various secret engines store different types of secrets
6. **Dynamic Secrets**: Vault can generate short-lived, on-demand credentials

## Common Operations

```bash
# Initialize Vault
vault operator init

# Unseal Vault
vault operator unseal <unseal-key>

# Authenticate
vault login <token>

# Write a secret
vault kv put secret/myapp/config username=dbuser password=dbpass

# Read a secret
vault kv get secret/myapp/config
```

## Security Considerations

- Unseal keys and root tokens should be secured and distributed
- Enable audit logging for all operations
- Use the principle of least privilege for policies
- Regular secret rotation is recommended

## Integration

In this project, Vault integrates with:
- Authentication services
- Database credential management
- Application configuration
- Certificate management

For more information, refer to the [HashiCorp Vault documentation](https://www.vaultproject.io/docs).
