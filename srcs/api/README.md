# 🖥️ Transcendance API (Backend)

The backend of Transcendance is a robust Django-based application designed for real-time multiplayer gaming, secure authentication, and scalable microservice interaction.

## 🚀 Technologies

- **Core**: [Django 5.1.3](https://www.djangoproject.com/)
- **API Framework**: [Django REST Framework (DRF)](https://www.django-rest-framework.org/)
- **Real-Time**: [Django Channels](https://channels.readthedocs.io/) (WebSockets)
- **Authentication**: JWT (SimpleJWT) with 2FA (TOTP)
- **Secrets**: [HashiCorp Vault](https://www.vaultproject.io/) (via `hvac`)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Caching/PubSub**: [Redis](https://redis.io/)

## 📂 Project Structure

- `apps/authentication`: Handles JWT tokens, 2FA, and user registration.
- `apps/pongue`: Real-time Pong game logic and WebSocket consumers.
- `apps/users`: User profile management, friend lists, and status tracking.
- `apps/utils`: Shared utilities and helpers.
- `config/`: Project-wide settings and routing.

## 🔐 Security Features

- **HashiCorp Vault Integration**: Sensitive data like database credentials and secret keys are securely stored in Vault and injected at runtime.
- **Two-Factor Authentication**: Optional TOTP-based 2FA for enhanced account security.
- **JWT Denylisting**: Secure sign-out and token invalidation.

## 📡 API Documentation

If the server is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost/api/docs/`
- Redoc: `http://localhost/api/redoc/`

## 🛠️ Development

To run the backend independently (not recommended outside of Docker):
1. Install dependencies: `pip install -r requirements.txt`
2. Configure `.env` based on `.env.example`.
3. Run migrations: `python manage.py migrate`
4. Start server: `python manage.py runserver` (Note: for WebSockets, use `daphne`).
