from .appmodels.manufacture import Material, Tare, Formula, FormulaComp
from .appmodels.org import Employee, Staff, Org
from .appmodels.sales import Client
from rest_framework import serializers


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    """
    Продукция предприятия
    """
    id = serializers.IntegerField()
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
    id = serializers.IntegerField()
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
    id = serializers.IntegerField()
    name = serializers.CharField()

    class Meta:
        model = Tare
        fields = ['id', 'name']


class FormulaCompSerializer(serializers.ModelSerializer):
    """
    Компоненты рецептуры
    """
    id = serializers.IntegerField(required=False)
    raw = RawSerializer(source='id_raw')
    raw_value = serializers.FloatField()

    class Meta:
        model = FormulaComp
        fields = ('id', 'raw', 'raw_value')


class FormulaListSerializer(serializers.ModelSerializer):
    """
    Рецептура (список)
    """
    product = serializers.CharField(source='id_product.name')
    calcAmount = serializers.FloatField(source='calc_amount')

    class Meta:
        model = Formula
        fields = ('id', 'product', 'calcAmount')


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

    def create(self, validated_data):
        formula = Formula.objects.create(
            id_product_id=validated_data['id_product']['id'],
            calc_amount=validated_data['calc_amount'],
            calc_losses=validated_data['calc_losses'],
            id_tare_id=validated_data['id_tare']['id'],
            specification=validated_data['specification']
        )
        id_formula = formula.id

        for raw in validated_data['get_raw_in_formula']:
            FormulaComp.objects.create(
                id_raw_id=raw['id_raw']['id'],
                id_formula_id=id_formula,
                raw_value=raw['raw_value']
            )
        return formula

    def update(self, instance, validated_data):
        instance.id_product_id = validated_data['id_product']['id']
        instance.calc_amount = validated_data['calc_amount']
        instance.calc_losses = validated_data['calc_losses']
        instance.id_tare_id = validated_data['id_tare']['id']
        instance.specification = validated_data['specification']

        old_mapping = {inst.id: inst for inst in instance.get_raw_in_formula()}
        data_mapping = {item['id']: item for item in validated_data['get_raw_in_formula']}

        for item in validated_data['get_raw_in_formula']:
            if item['id'] == 0:
                FormulaComp.objects.create(
                    id_raw_id=item['id_raw']['id'],
                    id_formula_id=instance.id,
                    raw_value=item['raw_value']
                )
            else:
                value = old_mapping.get(item['id'], None)
                value.id_raw_id = item['id_raw']['id']
                value.raw_value = item['raw_value']
                value.save()

        for data_id, data in old_mapping.items():
            if data_id not in data_mapping:
                data.delete()

        instance.save()
        return instance

    class Meta:
        model = Formula
        fields = ['id', 'created', 'product', 'calcAmount', 'calcLosses', 'specification', 'tare', 'raws']
