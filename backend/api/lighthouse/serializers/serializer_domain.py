from lighthouse.appmodels.org import Employee, Staff, Org, Department
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
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()

    class Meta:
        model = Staff
        fields = ('id', 'name')

    def create(self, validated_data):
        return Staff.objects.create(name=validated_data['name'])


class DepartmentSerializer(serializers.ModelSerializer):
    """
    Подразделения
    """
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()

    class Meta:
        model = Department
        fields = ('id', 'name')

    def create(self, validated_data):
        return Department.objects.create(name=validated_data['name'])

    def update(self, instance, validated_data):
        instance.name = validated_data['name']
        instance.save()
        return instance


class EmployeeSerializer(serializers.ModelSerializer):
    """
    Сотрудник (объект)
    """
    id = serializers.IntegerField(required=False)
    created = serializers.DateTimeField(required=False)
    tabNum = serializers.CharField(source='tab_num', allow_blank=True)
    fio = serializers.CharField()
    dob = serializers.DateField()
    iin = serializers.CharField()
    docType = serializers.IntegerField(source='doc_type')
    docDate = serializers.DateField(source='doc_date')
    docAuth = serializers.CharField(source='doc_auth')
    docNum = serializers.CharField(source='doc_num')
    addrRegistration = serializers.CharField(source='addr_registration')
    addrResidence = serializers.CharField(source='addr_residence')
    contactPhone = serializers.CharField(source='contact_phone')
    contactEmail = serializers.CharField(source='contact_email')
    staff = StaffSerializer(source='id_staff')

    def create(self, validated_data):
        id_staff = validated_data.pop('id_staff')['id']
        employee = Employee.objects.create(**validated_data, id_staff_id=id_staff)
        return employee

    def update(self, instance, validated_data):
        instance.tab_num = validated_data['tab_num']
        instance.fio = validated_data['fio']
        instance.dob = validated_data['dob']
        instance.iin = validated_data['iin']
        instance.doc_type = validated_data['doc_type']
        instance.doc_auth = validated_data['doc_auth']
        instance.doc_date = validated_data['doc_date']
        instance.doc_num = validated_data['doc_num']
        instance.addr_registration = validated_data['addr_registration']
        instance.addr_residence = validated_data['addr_residence']
        instance.contact_phone = validated_data['contact_phone']
        instance.contact_email = validated_data['contact_email']
        instance.id_staff_id = validated_data['id_staff']['id']
        instance.save()
        return instance

    class Meta:
        model = Employee
        fields = ('id', 'created', 'tabNum', 'fio', 'dob', 'iin', 'docType', 'docDate', 'docAuth', 'docNum',
                  'addrRegistration', 'addrResidence', 'contactPhone', 'contactEmail', 'staff')


class EmployeeListSerializer(serializers.ModelSerializer):
    """
    Сотрудники (список)
    """
    id = serializers.IntegerField()
    tabNum = serializers.CharField(source='tab_num',allow_blank=True)
    fio = serializers.CharField()
    staff = serializers.CharField(source='id_staff.name', allow_blank=True)

    class Meta:
        model = Employee
        fields = ('id', 'tabNum', 'fio', 'staff')


class EmployeeListSimpleSerializer(serializers.ModelSerializer):
    """
    Сотрудники (список)
    """
    id = serializers.IntegerField()
    tabNum = serializers.CharField(source='tab_num',allow_blank=True)
    fio = serializers.CharField()
    staff = serializers.CharField(source='id_staff__name', allow_blank=True)

    class Meta:
        model = Employee
        fields = ('id', 'tabNum', 'fio', 'staff')
