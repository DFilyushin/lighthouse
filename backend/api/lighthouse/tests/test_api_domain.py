from datetime import datetime
from django.test import TestCase, Client
from rest_framework import status
from lighthouse.appmodels.org import Org, Staff, Employee


class TestApiOrg(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        self.new_org = {
            'name': 'Предприятие 2',
            'addrReg': 'Адрес регистрации',
            'contactPhone': '777-555-888',
            'contactEmail': 'mail@mail.kz',
            'contactFax': '510676',
            'reqBin': '123456789123',
            'reqAccount': 'KZ123456789159951230',
            'reqBank': 'Просто Банк',
            'reqBik': 'HEGFSFV',
            'bossName': '1 рукводитель'
        }
        Org.objects.create(
            id=1,
            name='Предприятие 1',
            addr_reg='Адрес регистрации',
            contact_phone='777-555-888',
            contact_email='mail@mail.kz',
            contact_fax='510676',
            req_bin='123456789123',
            req_account='KZ123456789159951230',
            req_bank='Просто Банк',
            req_bik='HEGFSFV',
            boss_name='1 рукводитель'
        )

    def test_new_org(self):
        response = self.client.post('/org/', self.new_org)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_get_org(self):
        response = self.client.get('/org/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_org(self):
        response = self.client.put('/org/', data=self.new_org, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item = Org.objects.get(id=1)
        self.assertEqual(item.name, self.new_org.get('name'))
        self.assertEqual(item.addr_reg, self.new_org.get('addrReg'))
        self.assertEqual(item.contact_phone, self.new_org.get('contactPhone'))
        self.assertEqual(item.contact_email, self.new_org.get('contactEmail'))
        self.assertEqual(item.contact_fax, self.new_org.get('contactFax'))
        self.assertEqual(item.req_bin, self.new_org.get('reqBin'))
        self.assertEqual(item.req_bank, self.new_org.get('reqBank'))
        self.assertEqual(item.req_account, self.new_org.get('reqAccount'))
        self.assertEqual(item.req_bik, self.new_org.get('reqBik'))
        self.assertEqual(item.boss_name, self.new_org.get('bossName'))

    def test_delete_org(self):
        response = self.client.delete('/org/')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class TestApiStaff(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        self.new_staff = {
            'name': 'UpdateManager'
        }
        Staff.objects.create(
            id=2,
            name='First manager'
        )

    def test_get_staff_by_id(self):
        response = self.client.get('/staff/2/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'First manager')

    def test_new_staff(self):
        response = self.client.post('/staff/', data=self.new_staff, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        staffs = Staff.objects.all()
        self.assertEqual(staffs.count(), 2)

    def test_delete_staff(self):
        response = self.client.delete('/staff/2/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_staff(self):
        updated = 'manager_updated_new'
        response = self.client.put('/staff/2/', data={'name': updated}, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], updated)


class TestApiEmployee(TestCase):
    def setUp(self) -> None:
        self.client = Client()
        self.staff = Staff.objects.create(id=1, name='Сотрудник')
        Employee.objects.create(
            id=2,
            tab_num='1',
            fio='Сотрудник',
            dob=datetime.today(),
            iin='12345678910',
            doc_auth='МВД России',
            doc_date=datetime.today(),
            doc_num='0012 12542 4454',
            doc_type=1,
            addr_registration='Павлодар',
            addr_residence='Аксу',
            contact_email='employee@mail.ru',
            contact_phone='+7913965456212',
            id_staff=self.staff
        )
        self.new_employee = {
            'tabNum': '989',
            'fio': 'Махова Сауле Агаповна',
            'dob': '2000-05-05',
            'iin': '006565656656',
            'docType': 1,
            'docAuth': 'Austria, St1 Strasse',
            'docDate': '2001-05-02',
            'docNum': '0914 458896',
            'addrRegistration': 'Austria, St1 Strasse',
            'addrResidence': 'Austria, Lomke Strasse',
            'contactPhone': '+7 966 56232013',
            'contactEmail': 'mahova@mail.au',
            'staff': {
                'id': 1,
                'name': 'Сотрудник'
            }
        }

    def test_new_employee(self):
        response = self.client.post('/employee/', data=self.new_employee, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_employee(self):
        response = self.client.put('/employee/2/', data=self.new_employee, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_employee(self):
        response = self.client.delete('/employee/2/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)