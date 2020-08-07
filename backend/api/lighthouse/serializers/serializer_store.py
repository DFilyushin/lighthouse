from rest_framework import serializers
from lighthouse.appmodels.manufacture import Tare
from lighthouse.appmodels.store import Reservation
from lighthouse.appmodels.store import Store, RefCost, Cost, STORE_OPERATION_IN
from .serializer_domain import EmployeeListSerializer
from .serializer_product import RawSerializer
from .serializer_manufacture import ManufactureListSerializer
from .serializer_refs import MaterialSerializer, TareSerializer
from .serializer_sales import ContractSimpleSerializer


class StoreRawSerializer(serializers.Serializer):
    """
    Актуальный склад сырья
    """
    id = serializers.IntegerField(source='id_material__id')
    name = serializers.CharField(source='id_material__name')
    tare = serializers.CharField(source='id_tare__name')
    v = serializers.FloatField(source='id_tare__v')
    unit = serializers.CharField(source='id_tare__id_unit__name')
    total = serializers.FloatField()


class StoreProductSerializer(serializers.Serializer):
    """
    Актуальный склад готовой продукции
    """
    id = serializers.IntegerField(source='id_material__id')
    name = serializers.CharField(source='id_material__name')
    tare = serializers.CharField(source='id_tare__name')
    v = serializers.FloatField(source='id_tare__v')
    unit = serializers.CharField(source='id_tare__id_unit__name')
    total = serializers.FloatField()


class StoreJournalSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    material = serializers.CharField(source='id_material__name')
    tare = serializers.CharField(source='id_tare__name')
    date = serializers.DateField(source='oper_date')
    type = serializers.IntegerField(source='oper_type')
    value = serializers.FloatField(source='oper_value')
    price = serializers.FloatField(source='oper_price')
    factoryId = serializers.IntegerField(source='id_manufacture_id', allow_null=True)
    costId = serializers.IntegerField(source='id_cost_id', allow_null=True)

    class Meta:
        model = Store
        fields = ('id', 'material', 'tare', 'date', 'type', 'value', 'price', 'factoryId', 'costId')


class StoreTurnoverSerializer(serializers.Serializer):
    """
    Операция по обороту материалов на склады
    """
    id = serializers.IntegerField(required=False)
    materialId = serializers.IntegerField()
    date = serializers.DateField()
    total = serializers.FloatField()
    type = serializers.IntegerField()
    price=serializers.FloatField()
    employeeId = serializers.IntegerField()
    manufactureId = serializers.IntegerField(allow_null=True, required=False)
    expenseId = serializers.IntegerField(allow_null=True, required=False)

    def create(self, validated_data):
        turnover = Store.objects.create(
            id_material_id=validated_data['materialId'],
            id_manufacture_id=validated_data['manufactureId'],
            oper_date=validated_data['date'],
            oper_value=validated_data['total'],
            oper_type=validated_data['type'],
            id_employee_id=validated_data['employeeId'],
            id_cost_id=validated_data['expenseId'],
            oper_price=validated_data['price']
        )
        validated_data['id'] = turnover.id
        return validated_data

    def update(self, instance, validated_data):
        """
        Неоконченный код!!!!!!!!!!!!!
        """
        instance.id_material_id = validated_data['materialId']
        instance.oper_date = validated_data['date']
        instance.oper_value = validated_data['total']
        instance.save()


class RefCostSubSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    name = serializers.CharField()

    class Meta:
        model = RefCost
        fields = ('id', 'name')


class RefCostSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()
    parent = serializers.IntegerField(source='id_parent.id', allow_null=True, required=True)
    childs = RefCostSubSerializer(source='parentcost', many=True, required=False, read_only=True)
    raw = RawSerializer(source='id_raw', required=False)

    def create(self, validated_data):
        parent_item = validated_data.get('id_parent', None)
        id_parent = None
        if parent_item is not None:
            id_parent = parent_item['id']
        return RefCost.objects.create(
            name=validated_data['name'],
            id_parent_id=id_parent
        )

    def update(self, instance, validated_data):
        parent_item = validated_data['id_parent']['id']
        instance.name = validated_data['name']
        instance.id_parent_id = parent_item
        instance.save()
        return instance

    class Meta:
        model = RefCost
        fields = ('id', 'name', 'childs', 'parent', 'raw')


class ExpenseListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    cost = serializers.CharField(source='id_cost__name')
    date = serializers.DateField(source='cost_date')
    total = serializers.FloatField()

    class Meta:
        model = Cost
        fields = ('id', 'cost', 'date', 'total')


class ExpenseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    created = serializers.DateTimeField(required=False, allow_null=True)
    date = serializers.DateField(source='cost_date')
    cost = RefCostSerializer(source='id_cost')
    total = serializers.FloatField()
    count = serializers.FloatField(source='cost_count')
    employee = EmployeeListSerializer(source='id_employee')
    comment = serializers.CharField()

    def update(self, instance, validated_data):
        instance.cost_date = validated_data['cost_date']
        instance.total = validated_data['total']
        instance.comment = validated_data['comment']
        instance.id_employee_id = validated_data['id_employee']['id']
        instance.cost_count = validated_data['cost_count']
        instance.save()
        return instance

    class Meta:
        model = Cost
        fields = ('id', 'created', 'date', 'cost', 'total', 'count', 'employee', 'comment')


class StoreJournalItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    created = serializers.DateTimeField()
    materialId = MaterialSerializer(source='id_material')
    tareId = TareSerializer(source='id_tare')
    date = serializers.DateField(source='oper_date')
    type = serializers.IntegerField(source='oper_type')
    value = serializers.FloatField(source='oper_value')
    price = serializers.FloatField(source='oper_price')
    employee = EmployeeListSerializer(source='id_employee')
    factoryId = serializers.IntegerField(source='id_manufacture.id', allow_null=True)
    costId = ExpenseListSerializer(source='id_cost', allow_null=True)
    factory = ManufactureListSerializer(source='id_manufacture', allow_null=True)

    class Meta:
        model = Store
        fields = ('id', 'created', 'materialId', 'tareId', 'date', 'type', 'value', 'price', 'employee', 'factoryId', 'costId' , 'factory')


class StoreMaterialArrivalSerializer(serializers.Serializer):
    """
    Сырьё в приходе
    """
    material = serializers.IntegerField()
    tare = serializers.IntegerField()
    count = serializers.FloatField()
    price = serializers.FloatField()


class ReservationListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    material = serializers.CharField(source='id_material__name')
    start = serializers.DateField(source='reserve_start')
    end = serializers.DateField(source='reserve_end')
    employee = serializers.CharField(source='id_employee__fio')
    contract = serializers.CharField(source='id_contract__id_client__clientname')
    tare = serializers.CharField(source='id_tare__name')
    value = serializers.FloatField(source='reserve_value')

    class Meta:
        model = Reservation
        # fields = ('id', 'material', 'start', 'end', 'employee', 'contract', 'tare', 'value')
        fields = ('id', 'start', 'end', 'value', 'material', 'employee', 'contract', 'tare')


class ReservationSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=False)
    material = MaterialSerializer(source='id_material')
    start = serializers.DateField(source='reserve_start')
    end = serializers.DateField(source='reserve_end')
    employee = EmployeeListSerializer(source='id_employee')
    contract = ContractSimpleSerializer(source='id_contract')
    tare = TareSerializer(source='id_tare')
    value = serializers.FloatField(source='reserve_value')

    class Meta:
        model = Reservation
        fields = ('id', 'material', 'start', 'end', 'employee', 'contract', 'tare', 'value')


class StoreArrivalSerializer(serializers.Serializer):
    """
    Приход сырья на склад
    """
    date = serializers.DateField()
    employee = serializers.IntegerField()
    items = StoreMaterialArrivalSerializer(many=True)
    comment = serializers.CharField(allow_blank=True)

    def create(self, validated_data):
        income_date = validated_data['date']
        id_employee = validated_data['employee']
        comment = validated_data['comment']
        for item in validated_data['items']:
            count = item['count']
            price = item['price']
            total_value = count * price
            id_material = item['material']
            id_tare = item['tare']
            tare = Tare.objects.get(pk=id_tare)
            cost_count = tare.v * count

            ref_cost = RefCost.objects.filter(id_raw_id=id_material)
            if ref_cost:
                # на затраты ставим по факт. объёму: объём тары * количество
                cost = Cost.objects.create(
                    id_cost_id=ref_cost[0].id,
                    cost_date=income_date,
                    cost_count=cost_count,
                    total=cost_count * price,
                    id_employee_id=id_employee,
                    comment=comment
                )

                # на склад приходуем количество в таре
                Store.objects.create(
                    id_material_id=id_material,
                    id_tare_id=id_tare,
                    id_cost=cost,
                    oper_date=income_date,
                    oper_type=STORE_OPERATION_IN,
                    oper_price=price,
                    oper_value=count,
                    id_employee_id=id_employee
                )
        return validated_data
