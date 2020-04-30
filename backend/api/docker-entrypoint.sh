#!/usr/bin/env bash

echo "Set secret key"
python manage.py generatesecret

echo "Collect static files"
python manage.py collectstatic --noinput

echo "Apply web migrations"
python manage.py makemigrations 
python manage.py migrate

echo "Create super user"
python manage.py createadmin


# echo "Create default group"
# python manage.py loaddata ./fixtures/groups.json

echo "Starting server"
gunicorn -w 3 lighthouse.wsgi -b 0.0.0.0:8000
