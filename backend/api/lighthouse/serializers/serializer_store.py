from abc import ABC
from lighthouse.appmodels.manufacture import Material, Tare, Formula, FormulaComp, MaterialUnit
from lighthouse.appmodels.org import Employee, Staff, Org
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


class FormulaCompSerializer(serializers.ModelSerializer):
    """
    Компоненты рецептуры
    """
    id = serializers.IntegerField(default=0)
    raw = RawSerializer(source='id_raw')
    concentration = serializers.FloatField(default=100)
    substance = serializers.FloatField(default=0)
    raw_value = serializers.FloatField()

    class Meta:
        model = FormulaComp
        fields = ('id', 'raw', 'concentration', 'substance', 'raw_value')


class FormulaListSerializer(serializers.ModelSerializer):
    """
    Рецептура (список)
    """
    product = serializers.CharField(source='id_product.name')
    calcAmount = serializers.FloatField(source='calc_amount')
    created = serializers.DateTimeField()

    class Meta:
        model = Formula
        fields = ('id', 'product', 'calcAmount', 'created')


class NewFormulaSerializer(serializers.ModelSerializer):
    """
    Рецептура добавление/изменение
    """
    id = serializers.IntegerField(required=False)
    product = serializers.IntegerField(source='id_product_id')
    calcAmount = serializers.FloatField(source='calc_amount')
    calcLosses = serializers.FloatField(source='calc_losses')
    tare = serializers.IntegerField(source='id_tare_id')
    specification = serializers.CharField()
    raws = FormulaCompSerializer(source='get_raw_in_formula', many=True)
    density = serializers.FloatField()

    def create(self, validated_data):
        formula = Formula.objects.create(
            id_product_id=validated_data['id_product_id'],
            calc_amount=validated_data['calc_amount'],
            calc_losses=validated_data['calc_losses'],
            id_tare_id=validated_data['id_tare_id'],
            specification=validated_data['specification'],
            density=validated_data['density']
        )
        id_formula = formula.id

        for raw in validated_data['get_raw_in_formula']:
            FormulaComp.objects.create(
                id_raw_id=raw['id_raw']['id'],
                id_formula_id=id_formula,
                raw_value=raw['raw_value'],
                substance=raw['substance'],
                concentration=raw['concentration']
            )
        return formula

    def update(self, instance, validated_data):
        instance.id_product_id = validated_data['id_product_id']
        instance.calc_amount = validated_data['calc_amount']
        instance.calc_losses = validated_data['calc_losses']
        instance.id_tare_id = validated_data['id_tare_id']
        instance.specification = validated_data['specification']
        instance.density = validated_data['density']

        old_mapping = {inst.id: inst for inst in instance.get_raw_in_formula()}
        data_mapping = {item['id']: item for item in validated_data['get_raw_in_formula']}

        for item in validated_data['get_raw_in_formula']:
            if item['id'] <= 0:
                FormulaComp.objects.create(
                    id_raw_id=item['id_raw']['id'],
                    id_formula_id=instance.id,
                    raw_value=item['raw_value']
                )
            else:
                value = old_mapping.get(item['id'], None)
                value.id_raw_id = item['id_raw']['id']
                value.raw_value = item['raw_value']
                value.concentration = item['concentration']
                value.substance = item['substance']
                value.save()

        for data_id, data in old_mapping.items():
            if data_id not in data_mapping:
                data.delete()

        instance.save()
        return instance

    class Meta:
        model = Formula
        fields = ('id', 'product', 'calcAmount', 'calcLosses', 'tare', 'specification', 'density', 'raws')


class FormulaSerializer(serializers.ModelSerializer):
    """
    Рецептура (объект)
    """
    id = serializers.IntegerField(required=False)
    created = serializers.DateTimeField(required=False)
    product = ProductSerializer(source='id_product')
    calcAmount = serializers.FloatField(source='calc_amount')
    calcLosses = serializers.FloatField(source='calc_losses')
    tare = TareSerializer(source='id_tare')
    specification = serializers.CharField()
    raws = FormulaCompSerializer(source='get_raw_in_formula', many=True)
    density = serializers.FloatField()

    def create(self, validated_data):
        formula = Formula.objects.create(
            id_product_id=validated_data['id_product']['id'],
            calc_amount=validated_data['calc_amount'],
            calc_losses=validated_data['calc_losses'],
            id_tare_id=validated_data['id_tare']['id'],
            specification=validated_data['specification'],
            density=validated_data['density']
        )
        id_formula = formula.id

        for raw in validated_data['get_raw_in_formula']:
            FormulaComp.objects.create(
                id_raw_id=raw['id_raw']['id'],
                id_formula_id=id_formula,
                raw_value=raw['raw_value'],
                substance=raw['substance'],
                concentration=raw['concentration']
            )
        return formula

    def update(self, instance, validated_data):
        instance.id_product_id = validated_data['id_product']['id']
        instance.calc_amount = validated_data['calc_amount']
        instance.calc_losses = validated_data['calc_losses']
        instance.id_tare_id = validated_data['id_tare']['id']
        instance.specification = validated_data['specification']
        instance.density = validated_data['density']

        old_mapping = {inst.id: inst for inst in instance.get_raw_in_formula()}
        data_mapping = {item['id']: item for item in validated_data['get_raw_in_formula']}

        for item in validated_data['get_raw_in_formula']:
            if item['id'] == 0:
                FormulaComp.objects.create(
                    id_raw_id=item['id_raw']['id'],
                    id_formula_id=instance.id,
                    raw_value=item['raw_value'],
                    concentration=item['concentration'],
                    substance=item['substance']
                )
            else:
                value = old_mapping.get(item['id'], None)
                value.id_raw_id = item['id_raw']['id']
                value.raw_value = item['raw_value']
                value.substance = item['substance']
                value.concentration = item['concentration']
                value.save()

        for data_id, data in old_mapping.items():
            if data_id not in data_mapping:
                data.delete()

        instance.save()
        return instance

    class Meta:
        model = Formula
        fields = ['id', 'created', 'product', 'calcAmount', 'calcLosses', 'specification', 'density', 'tare', 'raws']


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


class StoreTurnoverSerializer(serializers.Serializer):
    """
    Операция по обороту материалов на склады
    """
    id = serializers.IntegerField(required=False)
    materialId = serializers.IntegerField()
    date = serializers.DateField()
    total = serializers.FloatField()
    type = serializers.IntegerField()
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
            id_cost_id=validated_data['expenseId']
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
