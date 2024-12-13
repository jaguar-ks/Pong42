#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

apk add jq

if [ ! -e cred.env ]; then
    echo "ROLE_ID=\"$(cat django-cred.json |  jq -r '.role_id')\"" >> cred.env
    echo "SECRET_ID=\"$(cat django-cred.json |  jq -r '.secret_id')\"" >> cred.env
    if [ ! -e db.sqlite3 ]; then
        echo "FIRST=\"1\"" >> cred.env
    else
        echo "FIRST=\"0\"" >> cred.env
    fi
fi

source cred.env
export ROLE_ID=$ROLE_ID
export SECRET_ID=$SECRET_ID

# Apply migrations
python3 manage.py makemigrations
python3 manage.py migrate


python3 manage.py shell < tools/create_superuser.py

if [ ${FIRST} == "1" ]; then
    python3 manage.py shell < tools/fake_users.py
    sed -i 's/FIRST=\"1\"/FIRST=\"0\"/' cred.env
fi
python manage.py runserver 0.0.0.0:8000
