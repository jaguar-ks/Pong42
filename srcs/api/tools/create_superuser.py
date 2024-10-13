import os
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError

# Read environment variables
username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD', '123')

# Ensure the variables are not None
if username and email and password:
    User = get_user_model()
    
    # Check if the user already exists
    if not User.objects.filter(username=username).exists():
        try:
            # Create the superuser
            User.objects.create_superuser(username=username, email=email, password=password)
            print(f"Superuser {username} created successfully.")
        except IntegrityError:
            print("Superuser creation failed, it might already exist.")
    else:
        print(f"Superuser {username} already exists.")
else:
    print("Environment variables for superuser creation are not set.")
