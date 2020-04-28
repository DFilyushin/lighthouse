from datetime import datetime
from rest_framework import serializers
from lighthouse.appmodels.manufacture import Manufacture, ProdTeam, ProdCalc, ProductionLine
from .serializer_store import ProductSerializer, FormulaSerializer, RawSerializer
from .serializer_domain import EmployeeListSerializer


class ProductLineSerializer(serializers.ModelSerializer):
    """
    Промышленная линия производства
    """
    id = serializers.IntegerField()
    name = serializers.CharField()

    class Meta:
        model = ProductionLine
        fields = ('id', 'name')


class ProdCalcRawsListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        calc_mapping = {calc.id: calc for calc in instance}
        data_mapping = {item['id']: item for item in validated_data}

        ret = []
        for calc_id, data in data_mapping.items():
            calc = calc_mapping.get(calc_id, None)
            if calc is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(calc, data))

        for calc_id, calc in calc_mapping.items():
            if calc_id not in data_mapping:
                calc.delete()

        return ret


class ProdCalcRawsSerializer(serializers.ModelSerializer):
    """
    Действительная калькуляция производственной карты
    """
    id = serializers.IntegerField(required=False)
    manufactureId = serializers.IntegerField(source='id_manufacture.id', required=True)
    raw = RawSerializer(source='id_raw', required=True)
    calcValue = serializers.FloatField(source='calc_value', required=True)

    def create(self, validated_data):
        id_manufacture = validated_data['id_manufacture']['id']
        id_raw = validated_data['id_raw']['id']
        calc = ProdCalc.objects.create(
            id_manufacture_id=id_manufacture,
            id_raw_id=id_raw,
            calc_value=validated_data['calc_value']
        )
        return calc

    def update(self, instance, validated_data):
        instance.id_raw_id = validated_data['id_raw']['id']
        instance.calc_value = validated_data['calc_value']
        instance.save()
        return instance

    class Meta:
        model = ProdCalc
        fields = ('id', 'manufactureId', 'raw', 'calcValue')
        list_serializer_class = ProdCalcRawsListSerializer


class ProdTeamSerializer(serializers.ModelSerializer):
    """
    Смены производства
    """
    manufactureId = serializers.IntegerField(source='id_manufacture.id')
    employee = EmployeeListSerializer(source='id_employee')
    periodStart = serializers.DateTimeField(source='period_start')
    periodEnd = serializers.DateTimeField(source='period_end', required=False, allow_null=True)

    def create(self, validated_data):
        id_manufacture = validated_data['id_manufacture']['id']
        id_employee = validated_data['id_employee']['id']
        ProdTeam.objects.create(
            id_manufacture_id=id_manufacture,
            id_employee_id=id_employee,
            period_start=validated_data['period_start'],
            period_end=validated_data['period_end']
        )

    class Meta:
        model = ProdTeam
        fields = ('id', 'manufactureId', 'employee', 'periodStart', 'periodEnd')


class ManufactureListSerializer(serializers.ModelSerializer):
    """
    Список производственных карт
    """
    id = serializers.IntegerField()
    prodStart = serializers.DateTimeField(source='prod_start')
    prodFinish = serializers.DateTimeField(source='prod_finish')
    product = serializers.CharField(source='id_formula.id_product.name')
    calcValue = serializers.FloatField(source='calc_value')
    leaderName = serializers.CharField(source='id_team_leader.fio')
    state = serializers.IntegerField(source='cur_state')

    class Meta:
        model = Manufacture
        many = True
        fields = ('id', 'prodStart', 'prodFinish', 'product', 'calcValue', 'leaderName', 'state')


class NewManufactureSerializer(serializers.ModelSerializer):
    """
    Сериализатор для новой записи
    """
    id = serializers.IntegerField(required=False)
    creator = serializers.IntegerField(source='id_creator_id')
    formula = serializers.IntegerField(source='id_formula_id')
    prodLine = serializers.IntegerField(source='id_line_id')
    teamLeader = serializers.IntegerField(source='id_team_leader_id')
    prodStart = serializers.DateTimeField(source='prod_start')
    prodFinish = serializers.DateTimeField(source='prod_finish', allow_null=True)
    calcValue = serializers.FloatField(source='calc_value')
    outValue = serializers.FloatField(source='out_value')
    lossValue = serializers.FloatField(source='loss_value')
    comment = serializers.CharField(allow_blank=True)

    class Meta:
        model = Manufacture
        fields = ('id', 'creator', 'formula', 'prodLine', 'teamLeader', 'prodStart',
                  'prodFinish', 'calcValue', 'outValue', 'lossValue', 'comment')


class ManufactureSerializer(serializers.ModelSerializer):
    """
    Производственная карта
    """
    id = serializers.IntegerField(required=False)
    created = serializers.DateTimeField(required=False)
    creator = EmployeeListSerializer(source='id_creator')
    product = ProductSerializer(source='id_formula.id_product')
    formula = FormulaSerializer(source='id_formula', required=False)
    idFormula = serializers.IntegerField(source='id_formula.id')
    prodLine = ProductLineSerializer(source='id_line')
    prodStart = serializers.DateTimeField(source='prod_start')
    prodFinish = serializers.DateTimeField(source='prod_finish', allow_null=True)
    calcValue = serializers.FloatField(source='calc_value')
    outValue = serializers.FloatField(source='out_value')
    lossValue = serializers.FloatField(source='loss_value')
    comment = serializers.CharField(allow_blank=True)
    teamLeader = EmployeeListSerializer(source='id_team_leader')
    curState = serializers.IntegerField(source='cur_state', required=False)

    def create(self, validated_data):
        manufacture = Manufacture.objects.create(
            created=datetime.today(),
            id_creator_id=validated_data['id_creator']['id'],
            id_team_leader_id=validated_data['id_team_leader']['id'],
            prod_start=validated_data['prod_start'],
            prod_finish=validated_data['prod_finish'],
            cur_state=0,
            out_value=validated_data['out_value'],
            loss_value=validated_data['loss_value'],
            comment=validated_data['comment'],
            id_line_id=validated_data['id_line']['id'],
            id_formula_id=validated_data['id_formula']['id'],
            calc_value=validated_data['calc_value']
        )
        return manufacture

    def update(self, instance, validated_data):
        instance.id_team_leader_id = validated_data['id_team_leader']['id']
        instance.id_formula_id = validated_data['id_formula']['id']
        instance.id_line_id = validated_data['id_line']['id']
        instance.prod_start = validated_data['prod_start']
        instance.prod_finish = validated_data['prod_finish']
        instance.calc_value = validated_data['calc_value']
        instance.loss_value = validated_data['loss_value']
        instance.out_value = validated_data['out_value']
        instance.comment = validated_data['comment']
        instance.save()
        return instance

    class Meta:
        model = Manufacture
        fields = ('id', 'created', 'creator', 'product', 'formula', 'prodLine', 'prodStart', 'prodFinish', 'calcValue',
                  'outValue', 'lossValue',  'comment', 'teamLeader', 'curState', 'idFormula')


class ManufactureExecuterSerializer(serializers.Serializer):
    date = serializers.DateField(required=True, allow_null=False)


class CalculationRequestSerializer(serializers.Serializer):
    """
    Запрос на рассчёт калькуляции
    """
    idFormula = serializers.IntegerField()
    count = serializers.FloatField(default=0)


class CalculationRawsResponseSerializer(serializers.Serializer):
    """
    Состав сырья в калькуляции
    """
    idRaw = serializers.IntegerField(source='id_raw_id')
    rawCount = serializers.FloatField(source='calculated')


class CalculationResponseSerializer(serializers.ModelSerializer):
    """
    Калькуляция
    """
    idFormula = serializers.IntegerField()
    count = serializers.FloatField(default=0)
    raws = CalculationRawsResponseSerializer(many=True)

