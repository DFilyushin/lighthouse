from datetime import datetime
from django.test import TestCase, Client
from rest_framework import status
from lighthouse.appmodels.manufacture import RefMaterialType, Material, Tare, Formula, Manufacture, ProductionLine
from lighthouse.appmodels.manufacture import FormulaComp
from lighthouse.appmodels.manufacture import MATERIAL_RAW_ID, MATERIAL_PRODUCT_ID
from lighthouse.appmodels.store import RefCost
from lighthouse.appmodels.org import Staff, Employee


class TestApiRaw(TestCase):

    def setUp(self) -> None:
        self.client = Client()
        RefMaterialType.objects.create(
            id=MATERIAL_RAW_ID,
            name='Сырьё'
        )
        RefCost.objects.create(
            id=0,
            name='не указано'
        )

    def test_create_raw(self):
        response = self.client.post('/raw/', data={'name': 'Сырьё 1'}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_raw_and_cost(self):
        response = self.client.post('/raw/', data={'name': 'Сырьё 1'}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        cost_catalog = RefCost.objects.get(id_raw_id=int(response.data['id']))
        self.assertEqual(cost_catalog.name, 'Закуп сырья Сырьё 1')

    def test_delete_raw(self):
        Material.objects.create(
            id=1,
            id_type_id=MATERIAL_RAW_ID,
            name='Сырьё'
        )
        response = self.client.delete('/raw/1/', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_raw(self):
        Material.objects.create(
            id=2,
            id_type_id=MATERIAL_RAW_ID,
            name='Сырьё № 2'
        )
        response = self.client.put('/raw/2/', data={'name': 'Raw2'}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        raw = Material.objects.get(id=2)
        self.assertEqual(raw.name, 'Raw2')


class TestApiProduct(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        RefMaterialType.objects.create(
            id=MATERIAL_PRODUCT_ID,
            name='Продукция'
        )
        RefCost.objects.create(
            id=0,
            name='не указано'
        )

    def test_create_product(self):
        response = self.client.post('/product/', data={'name': 'Продукция №1'}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_product(self):
        material = Material.objects.create(
            id=1,
            id_type_id=MATERIAL_PRODUCT_ID,
            name='На удаление'
        )
        response = self.client.delete('/product/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_product(self):
        Material.objects.create(
            id=2,
            id_type_id=MATERIAL_PRODUCT_ID,
            name='Продукция №1'
        )
        new_product_name = 'Продукция основная'
        response = self.client.put('/product/2/', data={'name': new_product_name}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        material = Material.objects.get(id=2)
        self.assertEqual(material.name, new_product_name)


class TestApiFormula(TestCase):

    def setUp(self) -> None:
        self.client = Client()
        self.new_formula = {
            'product': 1,
            'calcAmount': 100.34,
            'calcLosses': 10.2,
            'specification': 'Текст спецификации: ТУ, ГОСТ, дозировка и маркировка',
            'tare': 1,
            'raws': [
                {
                    'id': 0,
                    'raw': {
                        'id': 2,
                        'name': 'Сырьё 1'
                    },
                    'raw_value': 45.3432
                },
                {
                    'id': 0,
                    'raw': {
                        'id': 3,
                        'name': 'Сырьё 2'
                    },
                    'raw_value': 89.0934
                }
            ]
        }
        self.update_values = {
            'product': 1,
            'calcAmount': 111.55,
            'calcLosses': 222.34,
            'specification': 'Изменённый текст',
            'tare': 2,
            'raws': [
                {
                    'id': 5,
                    'raw': {
                        'id': 2,
                        'name': 'Сырьё 1'
                    },
                    'raw_value': 45.3432
                },
                {
                    'id': 6,
                    'raw': {
                        'id': 3,
                        'name': 'Сырьё 2'
                    },
                    'raw_value': 89.0934
                },
                {
                    'id': 0,
                    'raw': {
                        'id': 4,
                        'name': 'Сырьё 2'
                    },
                    'raw_value': 89.5551
                }

            ]
        }
        RefMaterialType.objects.create(id=MATERIAL_PRODUCT_ID, name='Продукция')
        RefMaterialType.objects.create(id=MATERIAL_RAW_ID, name='Сырьё')
        RefCost.objects.create(id=0, name='не указано')
        self.product = Material.objects.create(id=1, name='Продукция №1', id_type_id=MATERIAL_PRODUCT_ID)
        self.raw_1 = Material.objects.create(id=2, name='Сырьё 1', id_type_id=MATERIAL_RAW_ID)
        self.raw_2 = Material.objects.create(id=3, name='Сырьё 2', id_type_id=MATERIAL_RAW_ID)
        self.raw_3 = Material.objects.create(id=4, name='Сырьё 3', id_type_id=MATERIAL_RAW_ID)
        self.tare = Tare.objects.create(id=1, name='бочка')

    def test_create_formula(self):
        """
        Создание рецептуры
        :return:
        """
        response = self.client.post('/formula/', data=self.new_formula, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_formula(self):
        """
        Обновление рецептуры
        :return:
        """
        tare = Tare.objects.create(id=2, name='мешок')
        count = Formula.objects.count()
        self.assertEqual(count, 0)
        self.test_create_formula()
        count = Formula.objects.count()
        self.assertEqual(count, 1)

        id = Formula.objects.all()[0].id

        response = self.client.put('/formula/{}/'.format(id), data=self.update_values, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # проверка полей после обновления
        item = Formula.objects.get(id=id)

        self.assertEqual(item.calc_amount, 111.55)
        self.assertEqual(item.calc_losses, 222.34)
        self.assertEqual(item.specification, 'Изменённый текст')
        self.assertEqual(item.id_tare_id, 2)

        raw_01 = item.get_raw_in_formula().filter(id_raw=2)[0]
        self.assertEqual(raw_01.raw_value, 45.3432)
        raw_02 = item.get_raw_in_formula().filter(id_raw=3)[0]
        self.assertEqual(raw_02.raw_value, 89.0934)
        raw_03 = item.get_raw_in_formula().filter(id_raw=4)[0]
        self.assertEqual(raw_03.raw_value, 89.5551)

        self.assertEqual(item.get_raw_in_formula().count(), 3)

    def test_delete_formula(self):
        """
        Проверка удаления
        :return:
        """
        count = Formula.objects.count()
        self.assertEqual(count, 0)
        self.test_create_formula()
        count = Formula.objects.count()
        self.assertEqual(count, 1)
        id = Formula.objects.all()[0].id
        response = self.client.delete('/formula/{}/'.format(id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        count = Formula.objects.count()
        self.assertEqual(count, 0)

    def test_formula_calculation(self):
        """
        Проверка калькуляции
        """
        formula = Formula.objects.create(id=5, id_product=self.product, calc_losses=10, calc_amount=1000,
                                         id_tare=self.tare, is_active=True)
        FormulaComp.objects.create(id=100, id_formula=formula, id_raw=self.raw_1, raw_value=500)
        FormulaComp.objects.create(id=101, id_formula=formula, id_raw=self.raw_2, raw_value=400)
        FormulaComp.objects.create(id=102, id_formula=formula, id_raw=self.raw_3, raw_value=100.50)
        response = self.client.get('/formula/5/calc/?count=450', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        raws = data['raws']
        self.assertEqual(data['idFormula'], 5)
        self.assertEqual(data['count'], 450)
        self.assertEqual(len(raws), 3)
        for item in raws:
            print(item['idRaw'])
            if item['idRaw'] == 2:
                self.assertEqual(item['rawCount'], 225.0)
            if item['idRaw'] == 3:
                self.assertEqual(item['rawCount'], 180.0)
            if item['idRaw'] == 4:
                self.assertEqual(item['rawCount'], 45.225)


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
