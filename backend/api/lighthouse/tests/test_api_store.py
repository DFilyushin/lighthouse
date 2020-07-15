from django.test import TestCase, Client
from rest_framework import status
from lighthouse.appmodels.store import RefCost


class TestApiRefCost(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        self.new_cost = {
            'name': 'Новый вид затраты',
            'parent': ''
        }

    def test_create_ref_cost_without_parent(self):
        response = self.client.post('/cost/', data=self.new_cost)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_ref_cost_with_parent(self):
        response = self.client.post('/cost/', data=self.new_cost)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        id_record = response.data['id']
        new_cost_parent = {
            'name': 'Затрата 2',
            'parent': id_record
        }
        response = self.client.post('/cost/', data=new_cost_parent)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_ref_cost(self):
        record_1 = {
            'name': 'New ref cost',
            'parent': ''
        }
        record_2 = {
            'name': "child record",
            'parent': ''
        }

        response = self.client.post('/cost/', data=record_1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        id_new = response.data['id']
        response = self.client.post('/cost/', data=record_2)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        record_2['name'] = 'new'
        record_2['parent'] = id_new
        response = self.client.put('/cost/{}/'.format(id_new), data=record_2, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ref_cost = RefCost.objects.get(id=id_new)
        self.assertEqual(ref_cost.name, 'new')
        self.assertEqual(ref_cost.id_parent_id, id_new)

    def test_delete_ref_cost(self):
        RefCost.objects.create(id=1, name='Новая статья расходов')
        response = self.client.delete('/cost/1/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
