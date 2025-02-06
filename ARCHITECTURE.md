# 🏗️ Transcendance Architecture

This document provides an in-depth look at the architecture, security, and observability of the Transcendance project.

---

## 🏛️ System Design

Transcendance is designed with a microservices-first approach, emphasizing isolation, security, and real-time capabilities.

### 🌐 Reverse Proxy & WAF (Nginx)
Nginx serves as the entry point for all traffic. It handles:
- **SSL/TLS Termination**: Ensuring all external communication is encrypted.
- **WAF (ModSecurity)**: Integrated with **OWASP Core Rule Set (CRS)** to protect against common web attacks (SQLi, XSS, etc.).
- **Static File Serving**: Efficiently serving static assets for the frontend and backend.
- **Routing**: Proxying requests to the appropriate service based on the URL path.

### 🛠️ Backend Service (Django)
The backend manages the business logic, real-time gaming, and user data.
- **Django Channels**: Used for WebSocket-based real-time communication.
- **DRF**: Provides a robust RESTful API for frontend interaction.
- **PostgreSQL**: The primary relational database for persistent storage.
- **Redis**: Acts as the message broker for Channels and provides caching.

### 🎨 Frontend Service (Next.js)
A modern SPA built with the Next.js App Router.
- **Three.js**: Renders the Pong game in a 3D environment.
- **Tailwind CSS**: Utility-first styling for a premium, responsive UI.
- **NextUI & MUI**: Component libraries for a consistent design system.
- **WebSockets**: Direct connection to the backend for live gameplay.

---

## 🔐 Security Model

Security is a core pillar of Transcendance.

### 🗝️ Secret Management (Vault)
We use **HashiCorp Vault** to eliminate hardcoded credentials.
- **Secret Injection**: On system initialization, Vault generates or retrieves credentials (e.g., DB passwords, API keys).
- **Access Control**: Django and other services interact with Vault to obtain necessary secrets at runtime.

### 🛡️ Web Application Firewall (WAF)
ModSecurity is deployed as a module within Nginx. It inspects all incoming requests against the **OWASP CRS**, blocking malicious traffic before it reaches the application services.

### 🔑 Authentication & 2FA
- **JWT (SimpleJWT)**: Secure, stateless authentication for the REST API.
- **2FA (TOTP)**: Integration of Two-Factor Authentication using standard TOTP apps (e.g., Google Authenticator).
- **Email Verification**: Mandatory email verification for new accounts.

---

## 📊 Observability (ELK Stack)

The project includes a full **ELK Stack** for comprehensive system visibility.

- **Elasticsearch**: The search and analytics engine for storing and indexing logs.
- **Logstash**: Collects, processes, and ships logs from Nginx, PostgreSQL, Redis, Vault, and Django.
- **Kibana**: The visualization dashboard for analyzing logs and monitoring system health.

### Logging Flow
1. Services write logs to designated volumes.
2. Logstash monitors these volumes and parses the logs.
3. Indexed logs are sent to Elasticsearch.
4. Developers and administrators use Kibana for real-time analysis.

---

## 🔄 Deployment Flow

The entire stack is containerized using **Docker Compose**, orchestrated via a **Makefile**.

1. `make build`: Orchestrates the building of all custom images (Django, Nginx, Vue, etc.).
2. `make up`: Spins up the entire network of services.
3. `make init_vault`: Prepares the secret management system.
4. `make down`: Gracefully stops and removes all containers.
