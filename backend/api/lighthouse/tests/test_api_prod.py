from datetime import datetime
from django.test import TestCase, Client
from rest_framework import status
from lighthouse.appmodels.manufacture import RefMaterialType, Material, Tare, Formula, Manufacture, ProductionLine
from lighthouse.appmodels.manufacture import ProdTeam, ProdReadyProduct, CARD_STATE_IN_WORK
from lighthouse.appmodels.manufacture import MATERIAL_RAW_ID, MATERIAL_PRODUCT_ID
from lighthouse.appmodels.store import RefCost, Store
from lighthouse.appmodels.org import Staff, Employee
from lighthouse.endpoints.api_errors import API_ERROR_CARD_NOT_IN_WORK, API_ERROR_CARD_TEAM_ERROR, \
    API_ERROR_CARD_INCORRECT_TARE


class TestApiManufacture(TestCase):

    def setUp(self) -> None:
        self.client = Client()
        RefMaterialType.objects.create(id=MATERIAL_PRODUCT_ID, name='Продукция')
        RefMaterialType.objects.create(id=MATERIAL_RAW_ID, name='Сырьё')
        RefCost.objects.create(id=0, name='не указано')
        Staff.objects.create(id=1, name='должность')
        Material.objects.create(id=1, name='Продукция №1', id_type_id=MATERIAL_PRODUCT_ID)
        Material.objects.create(id=2, name='Сырьё 1', id_type_id=MATERIAL_RAW_ID)
        Material.objects.create(id=3, name='Сырьё 2', id_type_id=MATERIAL_RAW_ID)
        Material.objects.create(id=4, name='Сырьё 3', id_type_id=MATERIAL_RAW_ID)
        self.tare1 = Tare.objects.create(id=1, name='бочка', v=10)
        self.tare2 = Tare.objects.create(id=2, name='канистра', v=5)
        self.tare3 = Tare.objects.create(id=3, name='канистра 2', v=5)
        Formula.objects.create(id=1, id_tare=self.tare1, id_product_id=1, calc_amount=150.50, calc_losses=556.09,
                               specification='Some text')
        Employee.objects.create(id=1, fio='Сотрудник #1', dob=datetime.today(), iin='012345678912', doc_type=1, id_staff_id=1)
        Employee.objects.create(id=2, fio='Сотрудник #2', dob=datetime.today(), iin='012345678912', doc_type=1,
                                id_staff_id=1)
        Employee.objects.create(id=3, fio='Сотрудник #3', dob=datetime.today(), iin='012345678912', doc_type=1,
                                id_staff_id=1)
        ProductionLine.objects.create(id=1, name='1 линия')
        self.new_manufacture = {
            'creator': 1,
            'formula': 1,
            'prodLine': 1,
            'teamLeader': 1,
            'prodStart': '2019-04-28T06:54:41',
            'prodFinish': '2019-04-28T06:54:41',
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
            'prodStart': '2019-04-28T06:54:41',
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

    def test_add_team(self):
        """
        Тестирование добавления сотрудников в смену
        :return:
        """
        Manufacture.objects.create(
            id=2,
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
        teams = [
            {
                'manufactureId': 2,
                'periodStart': "2020-04-20T15:35:34",
                'periodEnd': None,
                "employee":
                {
                    "id": 2,
                    "tabNum": "100-12",
                    "fio": "Абдрахманов  Азамат",
                    "staff": "Директор"
                },
            },
            {
                'manufactureId': 2,
                'periodStart': "2020-04-20T15:35:34",
                'periodEnd': None,
                "employee":
                    {
                        "id": 2,
                        "tabNum": "100-12",
                        "fio": "Абдрахманов  Азамат",
                        "staff": "Директор"
                    },
            },
        ]
        teams2 = [
            {
                'manufactureId': 2,
                'periodStart': "2020-04-20T15:35:34",
                'periodEnd': None,
                "employee":
                    {
                        "id": 2,
                        "tabNum": "100-12",
                        "fio": "Абдрахманов  Азамат",
                        "staff": "Директор"
                    },
            },
        ]
        response = self.client.post('/prod/2/team/', data=teams, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        prod_team = ProdTeam.objects.filter(id_manufacture_id=2)
        self.assertEqual(prod_team.count(), 2)

        response = self.client.post('/prod/2/team/', data=teams2, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        prod_team = ProdTeam.objects.filter(id_manufacture_id=2)
        self.assertEqual(prod_team.count(), 3)

    def test_update_team(self):
        """
        Тестирование обновления списка сотрудников в смене
        :return:
        """
        Manufacture.objects.create(
            id=2,
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
        ProdTeam.objects.create(id=10, id_manufacture_id=2, id_employee_id=1, period_start=datetime.today())
        ProdTeam.objects.create(id=11, id_manufacture_id=2, id_employee_id=2, period_start=datetime.today())
        teams = [
            {
                'id': 10,
                'manufactureId': 2,
                'periodStart': "2020-03-20T15:35:34",
                'periodEnd': "2020-06-25T15:35:34",
                "employee":
                {
                    "id": 3,
                    "tabNum": "100-12",
                    "fio": "Абдрахманов  Азамат",
                    "staff": "Директор"
                },
            },
            {
                'id': 11,
                'manufactureId': 11,
                'periodStart': "2020-04-20T15:35:34",
                'periodEnd': None,
                "employee":
                    {
                        "id": 1,
                        "tabNum": "100-12",
                        "fio": "Абдрахманов  Азамат",
                        "staff": "Директор"
                    },
            },
        ]
        response = self.client.put('/prod/2/team/', data=teams, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # проверка обновлённых записей
        count = ProdTeam.objects.\
            filter(period_start__year=2020, period_start__month=3, id_employee_id=3, period_end__month=6).count()
        self.assertEqual(count, 1)

        count = ProdTeam.objects.\
            filter(period_start__year=2020, period_start__month=4, id_employee_id=1, period_end__isnull=True).count()
        self.assertEqual(count, 1)

        team_new = {
                'id': 0,
                'manufactureId': 2,
                'periodStart': "2020-05-04T15:35:34",
                'periodEnd': "2020-05-04T15:35:34",
                "employee": {
                        "id": 2,
                        "tabNum": "100-12",
                        "fio": "Абдрахманов  Азамат",
                        "staff": "Директор"
                    }
        }
        teams.append(team_new)

        # добавление новой записи через put-метод
        response = self.client.put('/prod/2/team/', data=teams, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        count = ProdTeam.objects.filter(id_manufacture_id=2).count()
        self.assertEqual(count, 3)

    def test_ok_execute(self):
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
        # проверка простого исполнения карты
        response = self.client.post('/prod/1/execute/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], 'Ошибка при сохранении данных: {}'.format(API_ERROR_CARD_NOT_IN_WORK))

    def test_set_status(self):
        Manufacture.objects.create(
            id=6,
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
        # проверка установки статуса
        response = self.client.post('/prod/6/setStatus/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        record = Manufacture.objects.get(id=6)
        self.assertEqual(record.cur_state, CARD_STATE_IN_WORK)

    def test_execute_team_error(self):
        # проверка исполнения карты с незакрытой сменой сотрудника

        Manufacture.objects.create(id=7, id_creator_id=1, id_team_leader_id=1, id_formula_id=1, id_line_id=1,
                                   prod_start=datetime.today(), prod_finish=datetime.today(), calc_value=0,
                                   loss_value=0, comment='Some text', cur_state=1)
        ProdTeam.objects.create(id=100, id_manufacture_id=7, id_employee_id=1, period_start=datetime.today(),
                                         period_end=datetime.today())
        ProdTeam.objects.create(id=101, id_manufacture_id=7, id_employee_id=2, period_start=datetime.today())
        response = self.client.post('/prod/7/execute/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], 'Ошибка при сохранении данных: {}'.format(API_ERROR_CARD_TEAM_ERROR))

    def test_execute_tare_error(self):
        prod = Manufacture.objects.create(id=8, id_creator_id=1, id_team_leader_id=1, id_formula_id=1, id_line_id=1,
                                          prod_start=datetime.today(), prod_finish=datetime.today(), calc_value=0,
                                          loss_value=0, comment='Some text', cur_state=1, out_value=500)
        ProdReadyProduct.objects.create(id_manufacture=prod, id_tare=self.tare1, tare_count=50)
        ProdReadyProduct.objects.create(id_manufacture=prod, id_tare=self.tare2, tare_count=2)
        response = self.client.post('/prod/8/execute/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['message'], 'Ошибка при сохранении данных: {}'.format(API_ERROR_CARD_INCORRECT_TARE))

    def test_execute_tare_ok(self):
        """
        Проверка фасовки готовой продукции
        """
        prod = Manufacture.objects.create(id=8, id_creator_id=1, id_team_leader_id=1, id_formula_id=1, id_line_id=1,
                                          prod_start=datetime.today(), prod_finish=datetime.today(), calc_value=0,
                                          loss_value=0, comment='Some text', cur_state=1, out_value=500)
        ProdReadyProduct.objects.create(id_manufacture=prod, id_tare=self.tare1, tare_count=50)
        response = self.client.post('/prod/8/execute/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_new_prod_ready_tare(self):
        """
        Тестировать добавление фасовки готовой продукции
        :return:
        """
        Manufacture.objects.create(id=1, id_creator_id=1, id_team_leader_id=1, id_formula_id=1, id_line_id=1,
                                   prod_start=datetime.today(), prod_finish=datetime.today(), calc_value=0,
                                   loss_value=0, comment='Some text', cur_state=1)
        tares = [
            {
                "tareId": 1,
                "count": 100
            },
            {
                "tareId": 1,
                "count": 2200
            }
        ]
        response = self.client.post('/prod/1/tare/', data=tares, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        count = ProdReadyProduct.objects.filter(id_manufacture_id=1).count()
        self.assertEqual(count, 2)

    def test_update_prod_ready_tare(self):
        """
        Тестировать обновление фасовки готовой продукции
        :return:
        """
        Manufacture.objects.create(id=1, id_creator_id=1, id_team_leader_id=1, id_formula_id=1, id_line_id=1,
                                   prod_start=datetime.today(), prod_finish=datetime.today(), calc_value=0,
                                   loss_value=0, comment='Some text', cur_state=1)
        ProdReadyProduct.objects.create(id=1, id_manufacture_id=1, id_tare_id=1, tare_count=100)
        ProdReadyProduct.objects.create(id=2, id_manufacture_id=1, id_tare_id=2, tare_count=200)
        tares = [
            {
                "id": 1,
                "tareId": 1,
                "count": 4
            },
            {
                "id": 2,
                "tareId": 1,
                "count": 5
            }
        ]
        response = self.client.put('/prod/1/tare/', data=tares, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        record = ProdReadyProduct.objects.get(id=1)
        self.assertEqual(record.tare_count, 4)
        record = ProdReadyProduct.objects.get(id=2)
        self.assertEqual(record.tare_count, 5)

    def test_delete_prod_ready_tare(self):
        Manufacture.objects.create(id=2, id_creator_id=1, id_team_leader_id=1, id_formula_id=1, id_line_id=1,
                                   prod_start=datetime.today(), prod_finish=datetime.today(), calc_value=0,
                                   loss_value=0, comment='Some text', cur_state=1)
        ProdReadyProduct.objects.create(id=10, id_manufacture_id=2, id_tare_id=1, tare_count=100)
        ProdReadyProduct.objects.create(id=20, id_manufacture_id=2, id_tare_id=2, tare_count=200)
        print(ProdReadyProduct.objects.filter(id_manufacture_id=2).count())
        tares = []
        response = self.client.put('/prod/2/tare/', data=tares, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ProdReadyProduct.objects.filter(id_manufacture_id=2).count(), 0)

    def test_update_and_delete_ready_tare(self):
        Manufacture.objects.create(id=20, id_creator_id=1, id_team_leader_id=1, id_formula_id=1, id_line_id=1,
                                   prod_start=datetime.today(), prod_finish=datetime.today(), calc_value=0,
                                   loss_value=0, comment='Some text', cur_state=1)
        ProdReadyProduct.objects.create(id=1, id_manufacture_id=20, id_tare_id=1, tare_count=1)
        ProdReadyProduct.objects.create(id=2, id_manufacture_id=20, id_tare_id=2, tare_count=2)
        tares = [
            {
                "id": 1,
                "tareId": 1,
                "count": 100
            },
            {
                "id": 2,
                "tareId": 3,
                "count": 200
            },
            {
                "tareId": 3,
                "count": 56
            }
        ]
        self.client.put('/prod/20/tare/', data=tares, content_type='application/json')
        self.assertEqual(ProdReadyProduct.objects.filter(id_manufacture_id=20).count(), 3)

    def test_execute_store(self):
        """
        Проверка передачи товара на СГП
        """
        manufacture = Manufacture.objects.create(id=20, id_creator_id=1, id_team_leader_id=1, id_formula_id=1, id_line_id=1,
                                   prod_start=datetime.today(), prod_finish=datetime.today(), calc_value=0,
                                   loss_value=0, comment='Some text', cur_state=1, out_value=100)
        ProdReadyProduct.objects.create(id=1, id_manufacture_id=20, id_tare=self.tare1, tare_count=8)
        ProdReadyProduct.objects.create(id=2, id_manufacture_id=20, id_tare=self.tare2, tare_count=2)
        response = self.client.post('/prod/20/execute/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        store = Store.objects.filter(id_material_id=manufacture.id_formula.id_product, id_tare=self.tare1, oper_value=8)
        self.assertEqual(store.count(), 1)

        store = Store.objects.filter(id_material_id=manufacture.id_formula.id_product, id_tare=self.tare2, oper_value=2)
        self.assertEqual(store.count(), 1)
