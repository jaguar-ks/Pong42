#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Start the Django development server
python3 manage.py runserver 0.0.0.0:8000

# # Keep the container alive if the server exits
# exec "$@"
