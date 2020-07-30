from lighthouse.appmodels.org import Employee
from lighthouse.appmodels.sales import Client, Contract, ContractSpec, PaymentMethod, Payment
from .serializer_refs import TareSerializer
from .serializer_product import ProductSerializer
from .serializer_domain import EmployeeListSerializer
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
    id = serializers.IntegerField(required=True)
    clientName = serializers.CharField(source='clientname')

    class Meta:
        model = Client
        fields = ('id', 'clientName')


class ContractSimpleSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    num = serializers.CharField()
    date = serializers.DateField(source='contract_date')
    client = serializers.CharField(source='id_client.clientname')

    class Meta:
        model = Contract
        fields = ('id', 'client', 'num', 'date')


class ContractListSerializer(serializers.ModelSerializer):
    """Контракты в договоре (список)"""
    id = serializers.IntegerField(source='id_contract__id')
    num = serializers.CharField(source='id_contract__num')
    clientName = serializers.CharField(source='id_contract__id_client__clientname')
    contractDate = serializers.DateField(source='id_contract__contract_date')
    estDelivery = serializers.DateField(source='id_contract__est_delivery')
    status = serializers.IntegerField(source='id_contract__contract_state')
    agent = serializers.CharField(source='id_contract__id_agent__fio')
    sum = serializers.FloatField()

    class Meta:
        model = Contract
        fields = ('id', 'clientName', 'num', 'contractDate', 'estDelivery', 'status', 'agent', 'sum')


class ContractSpecSerializer(serializers.ModelSerializer):
    """Спецификация контракта"""
    id = serializers.IntegerField()
    product = ProductSerializer(source='id_product')
    tare = TareSerializer(source='id_tare')
    itemCount = serializers.FloatField(source='item_count')
    itemPrice = serializers.FloatField(source='item_price')
    itemDiscount = serializers.FloatField(source='item_discount')
    itemTotal = serializers.FloatField(source='total')
    delivery = serializers.DateField(source='delivery_date', allow_null=True)
    delivered = serializers.DateField(allow_null=True)

    class Meta:
        model = ContractSpec
        fields = ('id', 'product', 'tare', 'itemCount', 'itemPrice', 'itemDiscount', 'itemTotal',  'delivery', 'delivered')


class PaymentMethodSerializer(serializers.ModelSerializer):
    """Метод оплаты"""
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()

    def update(self, instance, validated_data):
        instance.name = validated_data['name']
        instance.save()
        return instance

    def create(self, validated_data):
        return PaymentMethod.objects.create(name=validated_data['name'])

    class Meta:
        model = PaymentMethod
        fields = ('id', 'name')


class PaymentSerializer(serializers.ModelSerializer):
    """Платёж по контракту"""
    id = serializers.IntegerField()
    created = serializers.DateTimeField()
    contract = ContractSimpleSerializer(source='id_contract')
    method = PaymentMethodSerializer(source='pay_type')
    date = serializers.DateField(source='pay_date')
    num = serializers.CharField(source='pay_num')
    value = serializers.FloatField(source='pay_value')

    class Meta:
        model = Payment
        fields = ('id', 'created', 'contract', 'date', 'num', 'method', 'value')


class PaymentContractSerializer(serializers.ModelSerializer):
    """Оплаты в контракте"""
    id = serializers.IntegerField()
    created = serializers.DateTimeField()
    date = serializers.DateField(source='pay_date')
    num = serializers.CharField(source='pay_num')
    type = serializers.CharField(source='pay_type.name')
    value = serializers.FloatField(source='pay_value')

    class Meta:
        model = Payment
        fields = ('id', 'created', 'date', 'num', 'type', 'value')


class ContractSerializer(serializers.ModelSerializer):
    """Контракт"""
    id = serializers.IntegerField()
    created = serializers.DateTimeField()
    client = ClientListSerializer(source='id_client')
    num = serializers.CharField()
    contractDate = serializers.DateField(source='contract_date')
    contractState = serializers.IntegerField(source='contract_state')
    comment = serializers.CharField(required=False, allow_blank=True)
    estDelivery = serializers.DateField(source='est_delivery')
    delivered = serializers.DateField(allow_null=True, required=True)
    discount = serializers.FloatField(default=0)
    contractId = serializers.CharField(source='contractid')
    agent = EmployeeListSerializer(source='id_agent')
    specs = ContractSpecSerializer(many=True)
    payments = PaymentContractSerializer(many=True)

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        instance.client = Client.objects.get(pk=validated_data['id_client']['id'])
        instance.num = validated_data['num']
        instance.contract_date = validated_data['contract_date']
        instance.comment = validated_data['comment']
        instance.contractid = validated_data['contractid']
        instance.discount = validated_data['discount']
        instance.est_delivery = validated_data['est_delivery']
        instance.delivered = validated_data['delivered']
        instance.save()
        return instance

    class Meta:
        model = Contract
        fields = ('id', 'created', 'client', 'num', 'contractDate', 'contractState', 'comment', 'estDelivery',
                  'delivered', 'discount', 'contractId', 'agent', 'specs', 'payments')


class PaymentListSerializer(serializers.ModelSerializer):
    """Оплаты"""
    id = serializers.IntegerField()
    contract = ContractSimpleSerializer(source='id_contract')
    date = serializers.DateField(source='pay_date')
    num = serializers.CharField(source='pay_num')
    type = serializers.CharField(source='pay_type.name')
    value = serializers.FloatField(source='pay_value')

    class Meta:
        model = Payment
        fields = ('id', 'contract', 'client', 'date', 'num', 'type', 'value')
