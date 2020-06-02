from lighthouse.appmodels.manufacture import Material, Tare, Formula, FormulaComp
from lighthouse.appmodels.org import Employee, Staff, Org
from lighthouse.appmodels.sales import Client, Contract
from rest_framework import serializers


class ClientSerializer(serializers.ModelSerializer):
    """
    Клиент (объект)
    """
    created = serializers.DateTimeField(read_only=True)
    clientName = serializers.CharField(source='clientname')
    clientAddr = serializers.CharField(source='addr_reg')
    clientAgent = serializers.CharField(source='id_agent.fio', read_only=True)
    clientEmployee = serializers.CharField(source='contact_employee')
    contactPhone = serializers.CharField(source='contact_phone')
    contactEmail = serializers.CharField(source='contact_email', required=False, allow_blank=True, allow_null=True)
    contactFax = serializers.CharField(source='contact_fax', required=False, allow_blank=True, allow_null=True)
    reqBin = serializers.CharField(source='req_bin')
    reqAccount = serializers.CharField(source='req_account')
    reqBik = serializers.CharField(source='req_bik')
    reqBank = serializers.CharField(source='req_bank')
    comment = serializers.CharField(required=False, allow_blank=True)
    clientId = serializers.CharField(source='clientid', required=False, allow_blank=True)
    agentId = serializers.IntegerField(source='id_agent.id', required=False)

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
        instance.req_bank = validated_data.get('req_bank', instance.req_bank)
        instance.comment = validated_data.get('comment', instance.comment)
        instance.clientid = validated_data.get('clientid', instance.clientid)
        instance.save()
        return instance


class ClientListSerializer(serializers.ModelSerializer):
    """
    Клиенты (список)
    """
    id = serializers.IntegerField(required=False)
    clientName = serializers.CharField(source='clientname', read_only=True)
    clientAddr = serializers.CharField(source='addr_reg', read_only=True)
    clientAgent = serializers.CharField(source='id_agent.fio', read_only=True)
    clientEmployee = serializers.CharField(source='contact_employee', read_only=True)

    class Meta:
        model = Client
        fields = ('id', 'clientName', 'clientAddr', 'clientAgent', 'clientEmployee')


class ClientSimpleList(serializers.ModelSerializer):
    id = serializers.IntegerField(source='id', required=True)
    clientName = serializers.CharField(source='clientname', read_only=True)

    class Meta:
        model = Client
        fields = ('id', 'clientName')


class ContractListSerializer(serializers.ModelSerializer):
    """Контракты (список)"""
    # id_contract__id', 'id_contract__id_client__clientname', 'id_contract__contract_date', 'id_contract__est_delivery', 'id_contract__contract_state
    id = serializers.IntegerField(source='id_contract__id')
    num = serializers.CharField(source='id_contract__num')
    clientName = serializers.CharField(source='id_contract__id_client__clientname')
    contractDate = serializers.DateField(source='id_contract__contract_date')
    estDelivery = serializers.DateField(source='id_contract__est_delivery')
    status = serializers.IntegerField(source='id_contract__contract_state')
    sum = serializers.FloatField()

    class Meta:
        model = Contract
        fields = ('id', 'clientName', 'num', 'contractDate', 'estDelivery', 'status', 'sum')


class ContractSerializer(serializers.ModelSerializer):
    """Контракт"""
    id = serializers.IntegerField(source='id')
    created = serializers.DateTimeField(source='created')
    client = ClientSimpleList(source='id_client')
    num = serializers.CharField(source='num')
    contractDate = serializers.DateField(source='contract_date')
    contractState = serializers.IntegerField(source='contract_state')
    comment = serializers.CharField(source='comment', required=False, allow_blank=True)
    estDelivery = serializers.DateField(source='est_delivery')
    delivered = serializers.DateField(source='delivered', allow_null=True, required=True)
    discount = serializers.FloatField(source='discount', default=0)
    contractId = serializers.CharField(source='contractid')

    class Meta:
        model = Contract
        fields = ('id', 'created', 'id_client', 'num', 'contractDate', 'contractState', 'comment', 'estDelivery',
                  'delivered', 'discount', 'contractId')