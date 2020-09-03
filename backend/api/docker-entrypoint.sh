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

echo "initial auth and appsetup"
python manage.py loaddata ./fixtures/group.json
python manage.py loaddata ./fixtures/user.json
python manage.py loaddata ./fixtures/user_groups.json
python manage.py loaddata ./fixtures/appsetup.json
python manage.py loaddata ./fixtures/usersettings.json

echo "initial material, formula, components"
python manage.py loaddata ./fixtures/refmaterialtype.json
python manage.py loaddata ./fixtures/materialunit.json
python manage.py loaddata ./fixtures/tare.json
python manage.py loaddata ./fixtures/material.json
python manage.py loaddata ./fixtures/formula.json
python manage.py loaddata ./fixtures/formulacomp.json

echo "initial org"
python manage.py loaddata ./fixtures/org.json
python manage.py loaddata ./fixtures/department.json
python manage.py loaddata ./fixtures/staff.json
python manage.py loaddata ./fixtures/employee.json

echo "initial expense"
python manage.py loaddata ./fixtures/refcost.json
python manage.py loaddata ./fixtures/cost.json

echo "initial factory"
python manage.py loaddata ./fixtures/productionline.json
python manage.py loaddata ./fixtures/productionwork.json
python manage.py loaddata ./fixtures/manufacture.json
python manage.py loaddata ./fixtures/prodteam.json
python manage.py loaddata ./fixtures/prodcalc.json
python manage.py loaddata ./fixtures/prodreadyproduct.json

echo "initial sales"
python manage.py loaddata ./fixtures/client.json
python manage.py loaddata ./fixtures/contract.json
python manage.py loaddata ./fixtures/contractspec.json
python manage.py loaddata ./fixtures/claim.json
python manage.py loaddata ./fixtures/claimhistory.json
python manage.py loaddata ./fixtures/pricelist.json
python manage.py loaddata ./fixtures/reservation.json
python manage.py loaddata ./fixtures/contractexpectedpayment.json
python manage.py loaddata ./fixtures/paymentmethod.json
python manage.py loaddata ./fixtures/payment.json

echo "initial store"
python manage.py loaddata ./fixtures/store.json

echo "Starting server"
gunicorn -w 3 api.wsgi -b 0.0.0.0:8000
