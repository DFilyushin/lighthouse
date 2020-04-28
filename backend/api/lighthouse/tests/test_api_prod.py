from datetime import datetime
from django.test import TestCase, Client
from rest_framework import status
from lighthouse.appmodels.manufacture import RefMaterialType, Material, Tare, Formula, Manufacture, ProductionLine
from lighthouse.appmodels.manufacture import MATERIAL_RAW_ID, MATERIAL_PRODUCT_ID
from lighthouse.appmodels.store import RefCost
from lighthouse.appmodels.org import Staff, Employee


class TestApiManufacture(TestCase):

    def setUp(self) -> None:
        self.client = Client()
        RefMaterialType.objects.create(id=MATERIAL_PRODUCT_ID, name='Продукция')
        RefMaterialType.objects.create(id=MATERIAL_RAW_ID, name='Сырьё')
        RefCost.objects.create(id=0, name='не указано')
        Staff.objects.create(id=1, name='должность')
        product = Material.objects.create(id=1, name='Продукция №1', id_type_id=MATERIAL_PRODUCT_ID)
        raw_1 = Material.objects.create(id=2, name='Сырьё 1', id_type_id=MATERIAL_RAW_ID)
        raw_2 = Material.objects.create(id=3, name='Сырьё 2', id_type_id=MATERIAL_RAW_ID)
        raw_3 = Material.objects.create(id=4, name='Сырьё 3', id_type_id=MATERIAL_RAW_ID)
        tare = Tare.objects.create(id=1, name='бочка')
        Formula.objects.create(id=1, id_tare_id=1, id_product_id=1, calc_amount=150.50, calc_losses=556.09,
                               specification='Some text')
        Employee.objects.create(id=1, fio='Сотрудник', dob=datetime.today(), iin='012345678912', doc_type=1, id_staff_id=1)
        ProductionLine.objects.create(id=1, name='1 линия')
        self.new_manufacture = {
            'creator': 1,
            'formula': 1,
            'prodLine': 1,
            'teamLeader': 1,
            'prodStart': '2019-04-28T06:54:41+07:00',
            'prodFinish': '2019-04-28T06:54:41+07:00',
            'calcValue': 0,
            'outValue': 0,
            'lossValue': 0,
            'comment': '',
        }
        self.update_manufacture = {
            'creator': 1,
            'formula': 1,
            'prodLine': 1,
            'teamLeader': 1,
            'prodStart': '2019-04-28T06:54:41+07:00',
            'prodFinish': None,
            'calcValue': 10.05,
            'outValue': 90.98,
            'lossValue': 234.23,
            'comment': 'comments additional',
        }

    def test_create_manufacture(self):
        response = self.client.post('/prod/', data=self.new_manufacture, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_manufacture(self):
        Manufacture.objects.create(
            id=1,
            id_creator_id=1,
            id_team_leader_id=1,
            id_formula_id=1,
            id_line_id=1,
            prod_start=datetime.today(),
            prod_finish=datetime.today(),
            calc_value=0,
            loss_value=0,
            comment='Some text',
            cur_state=0
        )
        response = self.client.put('/prod/1/', data=self.update_manufacture, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_manufacture(self):
        Manufacture.objects.create(
            id=1,
            id_creator_id=1,
            id_team_leader_id=1,
            id_formula_id=1,
            id_line_id=1,
            prod_start=datetime.today(),
            prod_finish=datetime.today(),
            calc_value=0,
            loss_value=0,
            comment='Some text',
            cur_state=0
        )
        response = self.client.delete('/prod/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.delete('/prod/2/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
