from rest_framework import serializers
from lighthouse.appmodels.store import MaterialUnit, Material, Tare


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


class TareSerializer(serializers.HyperlinkedModelSerializer):
    """
    Тара
    """
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()
    idUnit = serializers.IntegerField(source='id_unit_id')
    unit = serializers.CharField(source='id_unit.name', required=False, allow_blank=True)
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
