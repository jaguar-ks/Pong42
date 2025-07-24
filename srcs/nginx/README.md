# NGINX Technologies Overview

## Overview

This directory contains the configuration files for NGINX, a high-performance HTTP server and reverse proxy, which serves as the web server and load balancer for the Pong42 application.

## Technologies

### NGINX

NGINX is a powerful, open-source web server that can also function as a:
- Reverse proxy
- Load balancer
- HTTP cache
- API gateway

### ModSecurity

This implementation includes ModSecurity, an open-source web application firewall (WAF) that provides protection against various attacks including:
- SQL injection
- Cross-site scripting (XSS)
- Local/Remote file inclusion
- Other OWASP Top 10 vulnerabilities

## Directory Structure

```
/srcs/nginx/
├── dockerfile         # Docker configuration for NGINX
├── README.md          # OWASP Core Rule Set documentation
├── NGINX-README.md    # This documentation file
├── conf/              # NGINX configuration files
│   └── nginx.conf     # Main NGINX configuration
├── modsecurity/       # ModSecurity WAF configuration
│   ├── modsecurity.conf       # Core ModSecurity configuration
│   └── owasp-crs/             # OWASP Core Rule Set
└── tools/             # Utility scripts for NGINX
```

## Configuration

### nginx.conf

The main NGINX configuration file that defines:
- Server blocks for different services
- Proxy settings for backend services
- SSL/TLS configurations
- HTTP headers and security settings
- Load balancing rules

### ModSecurity Configuration

ModSecurity is configured with the OWASP Core Rule Set (CRS) to provide security against common web attacks. Key configuration aspects include:
- Detection and prevention rules
- Logging settings
- Rule exclusions and tuning

## How It Works

1. **Client Request**: External requests hit the NGINX server first
2. **ModSecurity Processing**: Requests are analyzed by ModSecurity rules
3. **Reverse Proxy**: NGINX forwards valid requests to appropriate backend services:
   - Frontend application (Next.js)
   - API service (Django)
   - Other microservices
4. **Response Handling**: NGINX processes and delivers responses back to clients
5. **Logging**: Activity is logged for monitoring and debugging

## Security Features

- TLS/SSL termination
- HTTP security headers
- Rate limiting
- Request filtering
- Bot protection
- DDoS mitigation

## Integration

In the Pong42 project, NGINX integrates with:
- Frontend Next.js application
- Django API backend
- ELK stack for logging and monitoring
- Vault for certificate management

## Common Operations

```bash
# Test NGINX configuration
docker exec nginx nginx -t

# Reload NGINX configuration
docker exec nginx nginx -s reload

# View NGINX logs
docker logs nginx

# Check ModSecurity logs
docker exec nginx cat /var/log/modsec_audit.log
```

For more information, refer to the [NGINX documentation](https://nginx.org/en/docs/) and [ModSecurity documentation](https://github.com/SpiderLabs/ModSecurity/wiki).
