#!/usr/bin/env bash

echo "Set secret key"
python manage.py generatesecret

echo "Collect static files"
python manage.py collectstatic --noinput

echo "Apply web migrations"
python manage.py makemigrations lighthouse
python manage.py migrate

echo "Create super user"
python manage.py createadmin

echo "Initial store"
python manage.py loaddata ./fixtures/ref_unit.json
python manage.py loaddata ./fixtures/ref_cost.json
python manage.py loaddata ./fixtures/ref_org.json
python manage.py loaddata ./fixtures/ref_type_material.json
python manage.py loaddata ./fixtures/department.json
python manage.py loaddata ./fixtures/staff.json
python manage.py loaddata ./fixtures/employee.json
python manage.py loaddata ./fixtures/client.json
echo "Starting server"
gunicorn -w 3 api.wsgi -b 0.0.0.0:8000
