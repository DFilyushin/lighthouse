from django.test import TestCase, Client
from rest_framework import status
from lighthouse.appmodels.manufacture import RefMaterialType, Material
from lighthouse.appmodels.manufacture import MATERIAL_RAW_ID, MATERIAL_PRODUCT_ID
from lighthouse.appmodels.store import RefCost


class TestApiRaw(TestCase):

    def setUp(self) -> None:
        self.client = Client()
        RefMaterialType.objects.create(id=MATERIAL_RAW_ID, name='Сырьё')
        RefCost.objects.create(id=0, name='не указано')

    def test_create_raw(self):
        response = self.client.post('/raw/', data={'name': 'Сырьё 1'}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_raw_and_cost(self):
        """
        Проверка добавления новой записи сырья в статью расходов
        :return:
        """
        response = self.client.post('/raw/', data={'name': 'Сырьё 1'}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        cost_catalog = RefCost.objects.filter(id_raw_id=int(response.data['id']))
        self.assertEqual(cost_catalog.count(), 1)
        self.assertEqual(cost_catalog[0].name, 'Закуп сырья Сырьё 1')

    def test_delete_raw(self):
        Material.objects.create(id=1, id_type_id=MATERIAL_RAW_ID, name='Сырьё')
        response = self.client.delete('/raw/1/', content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_raw(self):
        Material.objects.create(id=2, id_type_id=MATERIAL_RAW_ID, name='Сырьё № 2')
        response = self.client.put('/raw/2/', data={'name': 'Raw2'}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        raw = Material.objects.get(id=2)
        self.assertEqual(raw.name, 'Raw2')


class TestApiProduct(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        RefMaterialType.objects.create(id=MATERIAL_PRODUCT_ID, name='Продукция')
        RefCost.objects.create(id=0, name='не указано')

    def test_create_product(self):
        response = self.client.post('/product/', data={'name': 'Продукция №1'}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_product(self):
        Material.objects.create(id=1, id_type_id=MATERIAL_PRODUCT_ID, name='На удаление')
        response = self.client.delete('/product/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_product(self):
        Material.objects.create(id=2, id_type_id=MATERIAL_PRODUCT_ID, name='Продукция №1')
        new_product_name = 'Продукция основная'
        response = self.client.put('/product/2/', data={'name': new_product_name}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        material = Material.objects.get(id=2)
        self.assertEqual(material.name, new_product_name)
