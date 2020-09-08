from rest_framework import serializers
from lighthouse.appmodels.manufacture import Formula, FormulaComp
from .serializer_product import RawSerializer, ProductSerializer
from .serializer_refs import MaterialUnitSerializer
from lighthouse.serializers.serializer_refs import TareSerializer


class FormulaListSerializer(serializers.ModelSerializer):
    """
    Рецептура (список)
    """
    product = serializers.CharField(source='id_product__name')
    calcAmount = serializers.FloatField(source='calc_amount')
    created = serializers.DateTimeField()

    class Meta:
        model = Formula
        fields = ('id', 'product', 'calcAmount', 'created')


class FormulaCompSerializer(serializers.ModelSerializer):
    """
    Компоненты рецептуры
    """
    id = serializers.IntegerField(default=0)
    raw = RawSerializer(source='id_raw')
    unit = MaterialUnitSerializer(source='id_unit')
    concentration = serializers.FloatField(default=100)
    substance = serializers.FloatField(default=0)
    raw_value = serializers.FloatField()

    class Meta:
        model = FormulaComp
        fields = ('id', 'raw', 'unit', 'concentration', 'substance', 'raw_value')


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
                concentration=raw['concentration'],
                id_unit_id=raw['id_unit']['id']
            )
        return formula

    def update(self, instance, validated_data):
        instance.id_product_id = validated_data['id_product']['id']
        instance.calc_amount = validated_data['calc_amount']
        instance.calc_losses = validated_data['calc_losses']
        instance.id_tare_id = validated_data['id_tare']['id']
        instance.specification = validated_data['specification']
        instance.density = validated_data['density']
        instance.id_unit_id = validated_data['id_unit']['id']

        old_mapping = {inst.id: inst for inst in instance.get_raw_in_formula()}
        data_mapping = {item['id']: item for item in validated_data['get_raw_in_formula']}

        for item in validated_data['get_raw_in_formula']:
            if item['id'] == 0:
                FormulaComp.objects.create(
                    id_raw_id=item['id_raw']['id'],
                    id_formula_id=instance.id,
                    raw_value=item['raw_value'],
                    concentration=item['concentration'],
                    substance=item['substance'],
                    id_unit_id=item['id_unit']['id']
                )
            else:
                value = old_mapping.get(item['id'], None)
                value.id_raw_id = item['id_raw']['id']
                value.raw_value = item['raw_value']
                value.substance = item['substance']
                value.concentration = item['concentration']
                value.unit_id_id = item['id_unit']['id']
                value.save()

        for data_id, data in old_mapping.items():
            if data_id not in data_mapping:
                data.delete()

        instance.save()
        return instance

    class Meta:
        model = Formula
        fields = ['id', 'created', 'product', 'calcAmount', 'calcLosses', 'specification', 'density', 'tare', 'raws']


class NewFormulaSerializer(serializers.ModelSerializer):
    """
    Рецептура добавление/изменение
    """
    id = serializers.IntegerField(required=False)
    product = serializers.IntegerField(source='id_product_id')
    calcAmount = serializers.FloatField(source='calc_amount')
    calcLosses = serializers.FloatField(source='calc_losses')
    tare = serializers.IntegerField(source='id_tare_id')
    specification = serializers.CharField(allow_null=True, allow_blank=True)
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
                id_unit_id=raw['id_unit']['id'],
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
                value.id_unit_id = item['id_unit']['id']
                value.save()

        for data_id, data in old_mapping.items():
            if data_id not in data_mapping:
                data.delete()

        instance.save()
        return instance

    class Meta:
        model = Formula
        fields = ('id', 'product', 'calcAmount', 'calcLosses', 'tare', 'specification', 'density', 'raws')
