from .appmodels.org import Employee, Staff, Org
from rest_framework import serializers


class OrgSerializer(serializers.ModelSerializer):
    """
    Реквизиты предприятия
    """
    name = serializers.CharField()
    addrReg = serializers.CharField(source='addr_reg')
    contactPhone = serializers.CharField(source='contact_phone')
    contactEmail = serializers.CharField(source='contact_email')
    contactFax = serializers.CharField(source='contact_fax')
    reqBin = serializers.CharField(source='req_bin')
    reqAccount = serializers.CharField(source='req_account')
    reqBank = serializers.CharField(source='req_bank')
    reqBik = serializers.CharField(source='req_bik')
    bossName = serializers.CharField(source='boss_name')

    class Meta:
        model = Org
        many = False
        fields = ('name', 'addrReg', 'contactPhone', 'contactEmail', 'contactFax', 'reqBin', 'reqBik',
                  'reqAccount', 'reqBank', 'bossName')


class StaffSerializer(serializers.ModelSerializer):
    """
    Должности
    """
    class Meta:
        model = Staff
        fields = ('id', 'name')


class EmployeeSerializer(serializers.ModelSerializer):
    """
    Сотрудник (объект)
    """
    created = serializers.DateTimeField()
    tabNum = serializers.CharField(source='tab_num')
    fio = serializers.CharField()
    dob = serializers.DateField()
    iin = serializers.CharField()
    docType = serializers.CharField(source='doc_type')
    docDate = serializers.DateField(source='doc_date')
    docAuth = serializers.CharField(source='doc_auth')
    docNum = serializers.CharField(source='doc_num')
    addrRegistration = serializers.CharField(source='addr_registration')
    addrResidence = serializers.CharField(source='addr_residence')
    contactPhone = serializers.CharField(source='contact_phone')
    contactEmail = serializers.CharField(source='contact_email')
    staff = StaffSerializer(read_only=True, source='id_staff')

    class Meta:
        model = Employee
        fields = ('created', 'tabNum', 'fio', 'dob', 'iin', 'docType', 'docDate', 'docAuth', 'docNum',
                  'addrRegistration', 'addrResidence', 'contactPhone', 'contactEmail', 'staff')


class EmployeeListSerializer(serializers.ModelSerializer):
    """
    Сотрудники (список)
    """
    tabNum = serializers.CharField(source='tab_num')
    fio = serializers.CharField()
    staff = serializers.CharField(source='id_staff.name')

    class Meta:
        model = Employee
        fields = ('id', 'tabNum', 'fio', 'staff')
