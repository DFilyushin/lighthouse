from rest_framework import serializers
from lighthouse.appmodels.manufacture import Material, MATERIAL_RAW_ID, MATERIAL_PRODUCT_ID, MATERIAL_STOCK_ID


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
        return Material.objects.create(name=validated_data['name'], id_type_id=MATERIAL_PRODUCT_ID)


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
        return Material.objects.create(name=validated_data['name'], id_type_id=MATERIAL_RAW_ID)


class StockSerializer(serializers.HyperlinkedModelSerializer):
    """
    Используемые ТМЗ
    """
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()

    class Meta:
        model = Material
        fields = ['id', 'name']

    def create(self, validated_data):
        return Material.objects.create(name=validated_data['name'], id_type_id=MATERIAL_STOCK_ID)
