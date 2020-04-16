from .appmodels.manufacture import Material, Tare, Formula
from .appmodels.org import Employee, Staff, Org
from .appmodels.sales import Client
from rest_framework import serializers


class OrgSerializer(serializers.ModelSerializer):
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


class MaterialSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Material
        fields = ['id', 'name']


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    """
    Продукция предприятия
    """
    class Meta:
        model = Material
        fields = ['id', 'name']

    def create(self, validated_data):
        return Material.objects.create(name=validated_data['name'], id_type_id=1)


class RawSerializer(serializers.HyperlinkedModelSerializer):
    """
    Используемое сырьё
    """
    class Meta:
        model = Material
        fields = ['id', 'name']

    def create(self, validated_data):
        return Material.objects.create(name=validated_data['name'], id_type_id=2)


class TareSerializer(serializers.HyperlinkedModelSerializer):
    """
    Тара
    """
    class Meta:
        model = Tare
        fields = ['id', 'name']


class FormulaSerializer(serializers.ModelSerializer):
    product = serializers.CharField(source='id_product.name', read_only=True)

    class Meta:
        model = Formula
        fields = ['id', 'created', 'calc_amount', 'product']


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    created = serializers.DateTimeField(read_only=True)
    clientName = serializers.CharField(source='clientname')
    clientAddr = serializers.CharField(source='addr_reg')
    clientAgent = serializers.CharField(source='id_agent.fio', read_only=True)
    clientEmployee = serializers.CharField(source='contact_employee')
    contactPhone = serializers.CharField(source='contact_phone')
    contactEmail = serializers.CharField(source='contact_email')
    contactFax = serializers.CharField(source='contact_fax')
    reqBin = serializers.CharField(source='req_bin')
    reqAccount = serializers.CharField(source='req_account')
    reqBik = serializers.CharField(source='req_bik')
    reqBank = serializers.CharField(source='req_bank')
    comment = serializers.CharField()
    clientId = serializers.CharField(source='clientid')
    agentId = serializers.IntegerField(source='id_agent.id')

    class Meta:
        model = Client
        fields = ('id', 'created', 'clientName', 'clientAddr', 'clientAgent', 'clientEmployee', 'contactPhone', 'agentId',
                  'contactEmail', 'contactFax', 'reqBin', 'reqBik', 'reqBank', 'reqAccount', 'comment', 'clientId')

    def create(self, validated_data):
        id_agent = validated_data.pop('id_agent')
        agent = Employee.objects.get(id=id_agent['id'])
        client_instance = Client.objects.create(**validated_data, id_agent=agent)
        return client_instance

    def update(self, instance, validated_data):
        id_agent = validated_data.pop('id_agent')
        agent = Employee.objects.get(id=id_agent['id'])
        instance.id_agent = agent
        instance.clientname = validated_data.get('clientname', instance.clientname)
        instance.contact_employee = validated_data.get('contact_employee', instance.contact_employee)
        instance.addr_reg = validated_data.get('addr_reg', instance.addr_reg)
        instance.contact_phone = validated_data.get('contact_phone', instance.contact_phone)
        instance.contact_email = validated_data.get('contact_email', instance.contact_email)
        instance.contact_fax = validated_data.get('contact_fax', instance.contact_fax)
        instance.req_bin = validated_data.get('req_bin', instance.req_bin)
        instance.req_account = validated_data.get('req_account', instance.req_account)
        instance.req_bik = validated_data.get('req_bik', instance.req_bik)
        instance.comment = validated_data.get('comment', instance.comment)
        instance.clientid = validated_data.get('clientid', instance.clientid)
        instance.save()
        return instance


class ClientListSerializer(serializers.ModelSerializer):
    clientName = serializers.CharField(source='clientname', read_only=True)
    clientAddr = serializers.CharField(source='addr_reg', read_only=True)
    clientAgent = serializers.CharField(source='id_agent.fio', read_only=True)
    clientEmployee = serializers.CharField(source='contact_employee', read_only=True)

    class Meta:
        model = Client
        fields = ('id', 'clientName', 'clientAddr', 'clientAgent', 'clientEmployee')
