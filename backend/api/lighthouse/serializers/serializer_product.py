from rest_framework import serializers
from lighthouse.appmodels.manufacture import Material


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

