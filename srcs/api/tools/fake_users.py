from apps.users.models import User
from faker import Faker
from config.env import env
from django.contrib.auth.hashers import make_password

f = Faker()

users = []

emails_set = set()
usernames_set = set()

num_of_fake_users = env.int('num_of_fake_users', 100)


fake_password = make_password('123')

while len(users) < num_of_fake_users:
    username = f.user_name()
    while username in usernames_set:
        username = f.user_name()
    email = f.email(domain='example.com')
    while email in emails_set:
        email = f.email(domain='example.com')
    usernames_set.add(username)
    emails_set.add(email)

    users.append(
        User(
            username=username,
            email=email,
            password=fake_password,
            first_name=f.first_name(),
            last_name=f.last_name(),
            is_email_verified=True,
            is_active=True,
            avatar_url=f.image_url(width=300, height=300)
        )
    )


User.objects.bulk_create(users)
