from lighthouse.appmodels.manufacture import Material, Tare,  MaterialUnit
from lighthouse.appmodels.store import Store, RefCost, Cost
from .serializer_domain import EmployeeListSerializer
from rest_framework import serializers


class MaterialUnitSerializer(serializers.ModelSerializer):
    """
    Единицы измерения
    """
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()

    class Meta:
        model = MaterialUnit
        fields = ('id', 'name')

    def create(self, validated_data):
        return MaterialUnit.objects.create(name=validated_data['name'])


class MaterialSerializer(serializers.ModelSerializer):
    """
    Материалы
    """
    id = serializers.IntegerField()
    name = serializers.CharField()

    class Meta:
        model = Material
        fields = ['id', 'name']


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    """
    Продукция предприятия
    """
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()

    class Meta:
        model = Material
        fields = ['id', 'name']

    def create(self, validated_data):
        return Material.objects.create(name=validated_data['name'], id_type_id=2)


class RawSerializer(serializers.HyperlinkedModelSerializer):
    """
    Используемое сырьё
    """
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()

    class Meta:
        model = Material
        fields = ['id', 'name']

    def create(self, validated_data):
        return Material.objects.create(name=validated_data['name'], id_type_id=1)


class TareSerializer(serializers.HyperlinkedModelSerializer):
    """
    Тара
    """
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()
    idUnit = serializers.IntegerField(source='id_unit_id')
    unit = serializers.CharField(source='id_unit.name', required=False)
    v = serializers.FloatField()

    class Meta:
        model = Tare
        fields = ['id', 'name', 'unit', 'v', 'idUnit']

    def create(self, validated_data):
        return Tare.objects.create(
            name=validated_data['name'],
            v=validated_data['v'],
            id_unit_id=validated_data['id_unit_id']
        )

    def update(self, instance, validated_data):
        instance.name = validated_data['name']
        instance.id_unit_id = validated_data['id_unit_id']
        instance.v = validated_data['v']
        instance.save()
        return instance


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
    materialId = MaterialSerializer(source='id_material')
    tareId = TareSerializer(source='id_tare')
    date = serializers.DateField(source='oper_date')
    type = serializers.IntegerField(source='oper_type')
    value = serializers.FloatField(source='oper_value')
    price = serializers.FloatField(source='oper_price')
    employee = EmployeeListSerializer(source='id_employee')
    factoryId = serializers.IntegerField(source='id_manufacture.id', allow_null=True)

    class Meta:
        model = Store
        fields = ('id', 'materialId', 'tareId', 'date', 'type', 'value', 'price', 'employee', 'factoryId')


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
    cost = serializers.CharField(source='id_cost.name')
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
