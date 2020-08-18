python manage.py dumpdata auth.user --indent 2 > ./fixtures/user.json
python manage.py dumpdata auth.group --indent 2 > ./fixtures/group.json

python manage.py dumpdata lighthouse.refmaterialtype --indent 2 > ./fixtures/refmaterialtype.json
python manage.py dumpdata lighthouse.materialunit --indent 2 > ./fixtures/materialunit.json
python manage.py dumpdata lighthouse.tare --indent 2 > ./fixtures/tare.json
python manage.py dumpdata lighthouse.material --indent 2 > ./fixtures/material.json
python manage.py dumpdata lighthouse.formula --indent 2 > ./fixtures/formula.json
python manage.py dumpdata lighthouse.formulacomp --indent 2 > ./fixtures/formulacomp.json

python manage.py dumpdata lighthouse.org --indent 2 > ./fixtures/org.json
python manage.py dumpdata lighthouse.department --indent 2 > ./fixtures/department.json
python manage.py dumpdata lighthouse.staff --indent 2 > ./fixtures/staff.json
python manage.py dumpdata lighthouse.employee --indent 2 > ./fixtures/employee.json

python manage.py dumpdata lighthouse.refcost --indent 2 > ./fixtures/refcost.json
python manage.py dumpdata lighthouse.cost --indent 2 > ./fixtures/cost.json

python manage.py dumpdata lighthouse.productionline --indent 2 > ./fixtures/productionline.json
python manage.py dumpdata lighthouse.productionwork --indent 2 > ./fixtures/productionwork.json
python manage.py dumpdata lighthouse.manufacture --indent 2 > ./fixtures/manufacture.json
python manage.py dumpdata lighthouse.prodcalc --indent 2 > ./fixtures/prodcalc.json
python manage.py dumpdata lighthouse.prodteam --indent 2 > ./fixtures/prodteam.json
python manage.py dumpdata lighthouse.prodreadyproduct --indent 2 > ./fixtures/prodreadyproduct.json

python manage.py dumpdata lighthouse.client --indent 2 > ./fixtures/client.json
python manage.py dumpdata lighthouse.contract --indent 2 > ./fixtures/contract.json
python manage.py dumpdata lighthouse.contractspec --indent 2 > ./fixtures/contractspec.json
python manage.py dumpdata lighthouse.contractexpectedpayment --indent 2 > ./fixtures/contractexpectedpayment.json
python manage.py dumpdata lighthouse.claim --indent 2 > ./fixtures/claim.json
python manage.py dumpdata lighthouse.claimhistory --indent 2 > ./fixtures/claimhistory.json

python manage.py dumpdata lighthouse.pricelist --indent 2 > ./fixtures/pricelist.json
python manage.py dumpdata lighthouse.reservation --indent 2 > ./fixtures/reservation.json