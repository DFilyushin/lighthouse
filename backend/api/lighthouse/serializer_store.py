from .appmodels.manufacture import Material, Tare, Formula, FormulaComp
from .appmodels.org import Employee, Staff, Org
from .appmodels.sales import Client
from rest_framework import serializers


class ProductSerializer(serializers.HyperlinkedModelSerializer):
    """
    Продукция предприятия
    """
    class Meta:
        model = Material
        fields = ['id', 'name']

    def create(self, validated_data):
        return Material.objects.create(name=validated_data['name'], id_type_id=2)


class RawSerializer(serializers.HyperlinkedModelSerializer):
    """
    Используемое сырьё
    """
    class Meta:
        model = Material
        fields = ['id', 'name']

    def create(self, validated_data):
        return Material.objects.create(name=validated_data['name'], id_type_id=1)


class TareSerializer(serializers.HyperlinkedModelSerializer):
    """
    Тара
    """
    class Meta:
        model = Tare
        fields = ['id', 'name']


class FormulaCompSerializer(serializers.ModelSerializer):
    raw = RawSerializer(source='id_raw')

    class Meta:
        model = FormulaComp
        fields = ('raw', 'raw_value')


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
    product = ProductSerializer(source='id_product')
    tare = TareSerializer(source='id_tare')
    calcLosses = serializers.FloatField(source='calc_losses')
    raws = FormulaCompSerializer(source='get_raw_in_formula', many=True)

    class Meta:
        model = Formula
        fields = ['id', 'created', 'product', 'calc_amount', 'calcLosses', 'specification', 'tare', 'raws']



