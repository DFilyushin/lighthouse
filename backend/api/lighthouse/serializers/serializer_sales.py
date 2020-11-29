from lighthouse.appmodels.org import Employee
from lighthouse.appmodels.sales import Client, Contract, ContractSpec, PaymentMethod, Payment, PriceList, \
    ContractExpectedPayment, CONTRACT_STATE_DRAFT, EmployeeContractAccess
from .serializer_refs import TareSerializer
from .serializer_product import ProductSerializer
from .serializer_domain import EmployeeListSerializer
from .serializer_reserve import ContractReservationListSerializer
from .serializer_refs import MaterialSerializer
from rest_framework import serializers


class ClientSerializer(serializers.ModelSerializer):
    """
    Клиент (объект)
    """
    id = serializers.IntegerField()
    created = serializers.DateTimeField(read_only=True)
    clientName = serializers.CharField(source='clientname')
    clientAddr = serializers.CharField(source='addr_reg')
    clientAgent = serializers.CharField(source='id_agent.fio', read_only=True)
    clientEmployee = serializers.CharField(source='contact_employee')
    contactPhone = serializers.CharField(source='contact_phone', allow_blank=True)
    contactEmail = serializers.CharField(source='contact_email', required=False, allow_blank=True, allow_null=True)
    contactFax = serializers.CharField(source='contact_fax', required=False, allow_blank=True, allow_null=True)
    reqBin = serializers.CharField(source='req_bin', allow_blank=True, allow_null=True)
    reqAccount = serializers.CharField(source='req_account', allow_blank=True, allow_null=True)
    reqBik = serializers.CharField(source='req_bik', allow_blank=True, allow_null=True)
    reqBank = serializers.CharField(source='req_bank', allow_blank=True, allow_null=True)
    reqBoss = serializers.CharField(source='req_boss', allow_blank=True, allow_null=True)
    comment = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    clientId = serializers.CharField(source='clientid', required=False, allow_blank=True)
    agentId = serializers.IntegerField(source='id_agent.id', required=False)

    class Meta:
        model = Client
        fields = ('id', 'created', 'clientName', 'clientAddr', 'clientAgent', 'clientEmployee', 'contactPhone',
                  'agentId', 'contactEmail', 'contactFax', 'reqBin', 'reqBik', 'reqBank', 'reqAccount', 'reqBoss',
                  'comment', 'clientId')

    def create(self, validated_data):
        id = validated_data.pop('id')
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
        instance.req_boss = validated_data.get('req_boss', instance.req_boss)
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
    clientBin = serializers.CharField(source='req_bin', read_only=True)

    class Meta:
        model = Client
        fields = ('id', 'clientName', 'clientAddr', 'clientAgent', 'clientEmployee', 'clientBin')


class ClientSimpleList(serializers.ModelSerializer):
    """Простой список клиентов"""
    id = serializers.IntegerField(required=True)
    clientName = serializers.CharField(source='clientname')

    class Meta:
        model = Client
        fields = ('id', 'clientName')


class ContractSimpleSerializer(serializers.ModelSerializer):
    """Простой список контрактов"""
    id = serializers.IntegerField()
    num = serializers.CharField()
    date = serializers.DateField(source='contract_date')
    client = serializers.CharField(source='id_client.clientname')

    class Meta:
        model = Contract
        fields = ('id', 'client', 'num', 'date')


class ContractListSerializer(serializers.ModelSerializer):
    """Контракты в договоре (список)"""
    id = serializers.IntegerField()
    num = serializers.CharField()
    clientName = serializers.CharField(source='id_client__clientname')
    contractDate = serializers.DateField(source='contract_date')
    estDelivery = serializers.DateField(source='est_delivery')
    status = serializers.IntegerField(source='contract_state')
    agent = serializers.CharField(source='id_agent__fio')
    sum = serializers.FloatField()
    payed = serializers.FloatField()

    class Meta:
        model = Contract
        fields = ('id', 'clientName', 'num', 'contractDate', 'estDelivery', 'status', 'agent', 'sum', 'payed')


class ContractList2Serializer(serializers.ModelSerializer):
    """Контракты в договоре (список)"""
    id = serializers.IntegerField()
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
    itemNds = serializers.FloatField(source='item_nds')
    itemDiscount = serializers.FloatField(source='item_discount')
    itemTotal = serializers.FloatField(source='total')
    delivery = serializers.DateField(source='delivery_date', allow_null=True)
    delivered = serializers.DateField(allow_null=True)
    specNum = serializers.CharField(source='spec_num')
    specDate = serializers.DateField(source='spec_date', allow_null=True)
    returned = serializers.DateField(allow_null=True)
    returnCause = serializers.CharField(source='return_cause', allow_null=True)
    returnValue = serializers.FloatField(source='return_value', allow_null=True)

    class Meta:
        model = ContractSpec
        fields = ('id', 'product', 'tare', 'itemCount', 'itemPrice', 'itemNds', 'itemDiscount', 'itemTotal',
                  'delivery', 'delivered', 'specNum', 'specDate', 'returned', 'returnCause', 'returnValue')


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
    id = serializers.IntegerField(required=False)
    created = serializers.DateTimeField(required=False, allow_null=True)
    contract = ContractSimpleSerializer(source='id_contract')
    method = PaymentMethodSerializer(source='pay_type')
    date = serializers.DateField(source='pay_date')
    num = serializers.CharField(source='pay_num')
    value = serializers.FloatField(source='pay_value')

    class Meta:
        model = Payment
        fields = ('id', 'created', 'contract', 'date', 'num', 'method', 'value')

    def create(self, validated_data):
        return Payment.objects.create(
            pay_type_id=validated_data['pay_type']['id'],
            id_contract_id=validated_data['id_contract']['id'],
            pay_value=validated_data['pay_value'],
            pay_date=validated_data['pay_date'],
            pay_num=validated_data['pay_num']
        )

    def update(self, instance, validated_data):
        instance.pay_type_id = validated_data['pay_type']['id']
        instance.pay_date = validated_data['pay_date']
        instance.pay_value = validated_data['pay_value']
        instance.pay_num = validated_data['pay_num']
        instance.id_contract_id = validated_data['id_contract']['id']
        instance.save()
        return instance


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


class ContractExpectedPaymentSerializer(serializers.ModelSerializer):
    """График платежей"""
    id = serializers.IntegerField()
    created = serializers.DateTimeField(required=False, allow_null=True)
    waitDate = serializers.DateField(source='wait_date')
    waitSum = serializers.FloatField(source='wait_value')

    class Meta:
        model = ContractExpectedPayment
        fields = ('id', 'created', 'waitDate', 'waitSum')


class ContractManagerAccessSerializer(serializers.ModelSerializer):
    """Доступ менеджеров к чужим контрактам"""
    id = serializers.IntegerField(required=False)
    employeeId = serializers.IntegerField(source='id_employee.id')
    employeeFio = serializers.CharField(source='id_employee.fio')
    toDate = serializers.DateField(source='to_date', allow_null=True)

    class Meta:
        model = EmployeeContractAccess
        fields = ('id', 'employeeId', 'employeeFio', 'toDate')


class ContractSerializer(serializers.ModelSerializer):
    """Контракт"""
    id = serializers.IntegerField(required=False)
    created = serializers.DateTimeField(required=False)
    client = ClientSerializer(source='id_client')
    num = serializers.CharField()
    contractDate = serializers.DateField(source='contract_date')
    contractState = serializers.IntegerField(source='contract_state')
    comment = serializers.CharField(required=False, allow_blank=True)
    estDelivery = serializers.DateField(source='est_delivery')
    delivered = serializers.DateField(allow_null=True)
    discount = serializers.FloatField(default=0)
    contractId = serializers.CharField(source='contractid', allow_null=True, allow_blank=True)
    agent = EmployeeListSerializer(source='id_agent')
    specs = ContractSpecSerializer(many=True)
    payments = PaymentContractSerializer(many=True)
    waitPayments = ContractExpectedPaymentSerializer(many=True, source='expected_payment')
    deliveryTerms = serializers.CharField(source='delivery_terms', allow_blank=True, allow_null=True)
    employeeAccess = ContractManagerAccessSerializer(source='employee_access', many=True)
    reserveProducts = ContractReservationListSerializer(source='contract_reserve_link', many=True)

    def create(self, validated_data):
        contract = Contract.objects.create(
            id_client_id=validated_data['id_client']['id'],
            num=validated_data['num'],
            comment=validated_data['comment'],
            deleted=False,
            delivered=validated_data['delivered'],
            est_delivery=validated_data['est_delivery'],
            contract_date=validated_data['contract_date'],
            contractid=validated_data['contractid'],
            discount=validated_data['discount'],
            delivery_terms=validated_data['delivery_terms'],
            contract_state=CONTRACT_STATE_DRAFT,
            id_agent_id=validated_data['id_agent']['id']
        )
        specs = validated_data.pop('specs')
        wait_payments = validated_data.pop('expected_payment')
        employeeAccess = validated_data.pop('employee_access')

        # сохранить спецификацию
        for item in specs:
            ContractSpec.objects.create(
                id_contract=contract,
                item_count=item['item_count'],
                item_price=item['item_price'],
                item_nds=item['item_nds'],
                item_discount=item['item_discount'],
                id_tare_id=item['id_tare']['id'],
                id_product_id=item['id_product']['id'],
                delivered=item['delivered'],
                delivery_date=item['delivery_date'],
                spec_num=item['spec_num'],
                spec_date=item['spec_date']
            )
        # сохранить график платежей
        for item in wait_payments:
            ContractExpectedPayment.objects.create(
                id_contract=contract,
                wait_date=item['wait_date'],
                wait_value=item['wait_value']
            )

        # сохранить разрешение для просмотра контракта
        for item in employeeAccess:
            EmployeeContractAccess.objects.create(
                id_employee_id=item['id_employee']['id'],
                id_contract=contract,
                to_date=item['to_date']
            )

        return contract

    def update(self, instance, validated_data):
        specs = validated_data.pop('specs')
        original_specs = instance.specs.all()

        wait_payments = validated_data.pop('expected_payment')
        original_payment = instance.expected_payment.all()

        employeeAccess = validated_data.pop('employee_access')
        original_access = instance.employee_access.all()

        original_specs_ids = {item.id: item for item in original_specs}
        data_mapping_specs = {}
        for item in specs:
            data_mapping_specs[item['id']] = item

        original_pay_ids = {item.id: item for item in original_payment}
        data_mapping_payment = {}
        for item in wait_payments:
            data_mapping_payment[item['id']] = item

        original_access_ids = {item.id: item for item in original_access}
        data_mapping_access = {}
        for item in employeeAccess:
            data_mapping_access[item['id']] = item

        instance.client = Client.objects.get(pk=validated_data['id_client']['id'])
        instance.num = validated_data['num']
        instance.contract_date = validated_data['contract_date']
        instance.comment = validated_data['comment']
        instance.contractid = validated_data['contractid']
        instance.discount = validated_data['discount']
        instance.est_delivery = validated_data['est_delivery']
        instance.delivered = validated_data['delivered']
        instance.delivery_terms = validated_data['delivery_terms']
        instance.save()

        # Сохранить изменения в графике платежей
        for object_id, item in data_mapping_payment.items():
            object_item = original_pay_ids.get(object_id, None)
            if object_item:
                payment = ContractExpectedPayment.objects.get(pk=object_id)
                payment.wait_date = item['wait_date']
                payment.wait_value = item['wait_value']
                payment.save()
            else:
                ContractExpectedPayment.objects.create(
                    id_contract=instance,
                    wait_date=item['wait_date'],
                    wait_value=item['wait_value']
                )
        for object_id, item in original_pay_ids.items():
            if object_id not in data_mapping_payment:
                item.delete()

        # Сохранить изменения в списке доступа
        for object_id, item in data_mapping_access.items():
            object_item = original_access_ids.get(object_id, None)
            if object_item:
                object_access = EmployeeContractAccess.objects.get(pk=object_id)
                object_access.to_date = item['to_date']
                object_access.save()
            else:
                EmployeeContractAccess.objects.create(
                    id_contract=instance,
                    id_employee_id=item['id_employee']['id'],
                    to_date=item['to_date']
                )
        for object_id, item in original_access_ids.items():
            if object_id not in data_mapping_access:
                item.delete()

        # Сохранить изменения в спецификации контракта
        for object_id, item in data_mapping_specs.items():
            object_item = original_specs_ids.get(object_id, None)
            if object_item:
                spec = ContractSpec.objects.get(pk=object_id)
                spec.item_count = item['item_count']
                spec.item_price = item['item_price']
                spec.item_nds = item['item_nds']
                spec.delivered = item['delivered']
                spec.delivery_date = item['delivery_date']
                spec.id_tare_id = item['id_tare']['id']
                spec.id_product_id = item['id_product']['id']
                spec.item_discount = item['item_discount']
                spec.spec_num = item['spec_num']
                spec.spec_date = item['spec_date']
                spec.save()
            else:
                ContractSpec.objects.create(
                    id_contract=instance,
                    item_count=item['item_count'],
                    item_price=item['item_price'],
                    item_nds=item['item_nds'],
                    item_discount=item['item_discount'],
                    id_tare_id=item['id_tare']['id'],
                    id_product_id=item['id_product']['id'],
                    delivered=item['delivered'],
                    delivery_date=item['delivery_date'],
                    spec_num=item['spec_num'],
                    spec_date=item['spec_date']
                )
        for object_id, item in original_specs_ids.items():
            if object_id not in data_mapping_specs:
                item.delete()
        return instance

    class Meta:
        model = Contract
        fields = ('id', 'created', 'client', 'num', 'contractDate', 'contractState', 'comment', 'estDelivery',
                  'delivered', 'discount', 'contractId', 'agent', 'deliveryTerms', 'specs', 'payments', 'waitPayments',
                  'employeeAccess', 'reserveProducts')


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
        fields = ('id', 'contract', 'date', 'num', 'type', 'value')


class ReturnsListSerializer(serializers.ModelSerializer):
    """Возвраты готовой продукции по контрактам"""
    id = serializers.IntegerField()
    contractId = serializers.IntegerField(source='id_contract__id')
    contractNum = serializers.CharField(source='id_contract__num')
    contractDate = serializers.DateField(source='id_contract__contract_date')
    contractClient = serializers.CharField(source='id_contract__id_client__clientname')
    date = serializers.DateField(source='returned')
    product = serializers.CharField(source='id_product__name')
    tare = serializers.CharField(source='id_tare__name')
    count = serializers.FloatField(source='item_count')
    total = serializers.FloatField(source='total_value')

    class Meta:
        model = ContractSpec
        fields = ('id', 'contractId', 'contractNum', 'contractDate', 'contractClient', 'date', 'product', 'tare',
                  'count', 'total')


class ReturnsSerializer(serializers.ModelSerializer):
    """Возврат готовой продукции"""
    id = serializers.IntegerField()
    contract = ContractSimpleSerializer(source='id_contract')
    date = serializers.DateField(source='returned')
    product = ProductSerializer(source='id_product')
    tare = TareSerializer(source='id_tare')
    count = serializers.FloatField(source='item_count')
    total = serializers.FloatField(source='total_value')
    returnCause = serializers.CharField(source='return_cause', allow_blank=True, allow_null=True)
    returnValue = serializers.FloatField(source='return_value', default=0)

    class Meta:
        model = ContractSpec
        fields = ('id', 'contract', 'date', 'product', 'tare', 'count', 'total', 'returnCause', 'returnValue')
