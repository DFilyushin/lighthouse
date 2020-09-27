from random import randint
from datetime import datetime
from rest_framework import serializers
from lighthouse.appmodels.manufacture import Manufacture, ProdTeam, ProdCalc, ProductionLine, \
    ProdReadyProduct, ProductionWork, ProdMaterial, Team, TeamMember
from .serializer_product import ProductSerializer, RawSerializer
from .serializer_formula import FormulaSerializer
from .serializer_domain import EmployeeListSerializer
from .serializer_refs import MaterialUnitSerializer


class WorkSerializer(serializers.ModelSerializer):
    """
    Виды работ производства
    """
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()

    class Meta:
        model = ProductionWork
        fields = ('id', 'name')

    def create(self, validated_data):
        return ProductionWork.objects.create(name=validated_data['name'])


class TeamListSerializer(serializers.ModelSerializer):
    """
    Список шаблонов смен
    """
    id = serializers.IntegerField()
    name = serializers.CharField(max_length=100, allow_null=False)

    class Meta:
        model = Team
        fields = ('id', 'name')


class TeamSerializer(serializers.ModelSerializer):
    """
    Шаблон смены
    """
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=100, allow_null=False, allow_blank=False)
    work = WorkSerializer(source='id_work')
    members = EmployeeListSerializer(many=True)

    def create(self, validated_data):
        members = validated_data.pop('members')
        team = Team.objects.create(
            name=validated_data['name'],
            id_work_id=validated_data['id_work']['id']
        )
        for item in members:
            TeamMember.objects.create(
                id_team=team,
                id_employee_id=item['id']
            )
        return team

    def update(self, instance, validated_data):
        instance.name = validated_data['name']
        instance.id_work_id = validated_data['id_work']['id']
        members = validated_data.pop('members')

        old_mapping = {inst.id: inst for inst in instance.members.all()}
        data_mapping = {item['id']: item for item in members}

        for item in members:
            if item['id'] not in old_mapping:
                TeamMember.objects.create(
                    id_team=instance,
                    id_employee_id=item['id']
                )
        for data_id, data in old_mapping.items():
            if data_id not in data_mapping:
                data.delete()
        instance.save()
        return instance

    class Meta:
        model = Team
        fields = ('id', 'name', 'work', 'members')


class ProductLineSerializer(serializers.ModelSerializer):
    """
    Промышленная линия производства
    """
    id = serializers.IntegerField(required=False)
    name = serializers.CharField()

    class Meta:
        model = ProductionLine
        fields = ('id', 'name')

    def create(self, validated_data):
        return ProductionLine.objects.create(name=validated_data['name'])


class ProdCalcRawsListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        calc_mapping = {calc.id: calc for calc in instance}
        data_mapping = {}
        for item in validated_data:
            if item['id'] == 0:
                item['id'] = - randint(1, 100000)
            data_mapping[item['id']] = item

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
    unit = MaterialUnitSerializer(source='id_unit', required=True)
    raw = RawSerializer(source='id_raw', required=True)
    calcValue = serializers.FloatField(source='calc_value', required=True)

    def create(self, validated_data):
        id_manufacture = validated_data['id_manufacture']['id']
        id_raw = validated_data['id_raw']['id']
        id_unit = validated_data['id_unit']['id']
        calc = ProdCalc.objects.create(
            id_manufacture_id=id_manufacture,
            id_raw_id=id_raw,
            id_unit_id=id_unit,
            calc_value=validated_data['calc_value']
        )
        return calc

    def update(self, instance, validated_data):
        instance.id_unit_id = validated_data['id_unit']['id']
        instance.id_raw_id = validated_data['id_raw']['id']
        instance.calc_value = validated_data['calc_value']
        instance.save()
        return instance

    class Meta:
        model = ProdCalc
        fields = ('id', 'manufactureId', 'raw', 'unit', 'calcValue')
        list_serializer_class = ProdCalcRawsListSerializer


class ProdTeamListSerializer(serializers.ListSerializer):

    def update(self, instance, validated_data):
        team_mapping = {team.id: team for team in instance}
        data_mapping = {}
        for item in validated_data:
            if item['id'] == 0:
                item['id'] = - randint(1, 100000)
            data_mapping[item['id']] = item

        ret = []
        for team_id, data in data_mapping.items():
            calc = team_mapping.get(team_id, None)
            if calc is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(calc, data))

        for team_id, calc in team_mapping.items():
            if team_id not in data_mapping:
                calc.delete()

        return ret


class ProdTeamReportSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    employee = EmployeeListSerializer(source='id_employee')
    product = serializers.CharField(source='id_manufacture.id_formula.id_product.name')
    line = serializers.CharField(source='id_manufacture.id_line.name')
    periodStart = serializers.DateTimeField(source='period_start')
    periodEnd = serializers.DateTimeField(source='period_end', required=False, allow_null=True)
    work = WorkSerializer(source='id_work')
    hours = serializers.IntegerField(source='get_hours')

    class Meta:
        model = ProdTeam
        fields = ('id', 'employee', 'product', 'line', 'periodStart', 'periodEnd', 'work', 'hours')
        list_serializer_class = ProdTeamListSerializer


class ProdTeamSerializer(serializers.ModelSerializer):
    """
    Смены производства
    """
    id = serializers.IntegerField(required=False)
    manufactureId = serializers.IntegerField(source='id_manufacture.id')
    employee = EmployeeListSerializer(source='id_employee')
    periodStart = serializers.DateTimeField(source='period_start')
    periodEnd = serializers.DateTimeField(source='period_end', required=False, allow_null=True)
    work = WorkSerializer(source='id_work')

    def create(self, validated_data):
        id_manufacture = validated_data['id_manufacture']['id']
        id_employee = validated_data['id_employee']['id']
        id_work = validated_data['id_work']['id']
        ProdTeam.objects.create(
            id_manufacture_id=id_manufacture,
            id_employee_id=id_employee,
            period_start=validated_data['period_start'],
            period_end=validated_data['period_end'],
            id_work_id=id_work
        )

    def update(self, instance, validated_data):
        instance.id_employee_id = validated_data['id_employee']['id']
        instance.id_work_id = validated_data['id_work']['id']
        instance.period_start = validated_data['period_start']
        instance.period_end = validated_data['period_end']
        instance.save()

    class Meta:
        model = ProdTeam
        fields = ('id', 'manufactureId', 'employee', 'periodStart', 'periodEnd', 'work')
        list_serializer_class = ProdTeamListSerializer


class ProdReadyProductListSerializer(serializers.ListSerializer):

    def update(self, instance, validated_data):
        tare_mapping = {team.id: team for team in instance}
        data_mapping = {}
        for item in validated_data:
            if 'id' not in item or item['id'] ==0:
                item['id'] = - randint(1, 100000)
            data_mapping[item['id']] = item

        ret = []
        for record_id, data in data_mapping.items():
            item = tare_mapping.get(record_id, None)
            if item is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(item, data))

        for record_id, item in tare_mapping.items():
            if record_id not in data_mapping:
                item.delete()

        return ret


class ProdReadyProductSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    tareId = serializers.IntegerField(source='id_tare_id')
    tareName = serializers.CharField(source='id_tare.name', required=False)
    tareV = serializers.FloatField(source='id_tare.v', required=False)
    count = serializers.IntegerField(source='tare_count')

    def create(self, validated_data):
        id_manufacture = self.context['id']
        ProdReadyProduct.objects.create(
            id_manufacture_id=id_manufacture,
            id_tare_id=validated_data['id_tare_id'],
            tare_count=validated_data['tare_count']
        )

    def update(self, instance, validated_data):
        id_manufacture = int(self.context['id'])
        instance.id_manufacture_id = id_manufacture
        instance.id_tare_id = validated_data['id_tare_id']
        instance.tare_count = validated_data['tare_count']
        instance.save()

    class Meta:
        model = ProdReadyProduct
        fields = ('id', 'tareId', 'tareName', 'tareV', 'count')
        list_serializer_class = ProdReadyProductListSerializer


class ManufactureListSerializer(serializers.ModelSerializer):
    """
    Список производственных карт
    """
    id = serializers.IntegerField()
    prodStart = serializers.DateTimeField(source='prod_start')
    prodFinish = serializers.DateTimeField(source='prod_finish')
    product = serializers.CharField(source='id_formula__id_product__name')
    calcValue = serializers.FloatField(source='calc_value')
    leaderName = serializers.CharField(source='id_team_leader__fio')
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
    idRaw = RawSerializer(source='id_raw')
    idUnit = MaterialUnitSerializer(source='id_unit')
    rawCount = serializers.FloatField(source='calculated')


class CalculationResponseSerializer(serializers.ModelSerializer):
    """
    Калькуляция
    """
    idFormula = serializers.IntegerField()
    count = serializers.FloatField(default=0)
    raws = CalculationRawsResponseSerializer(many=True)


class ProdMaterialListSerializer(serializers.ListSerializer):

    def update(self, instance, validated_data):
        material_mapping = {team.id: team for team in instance}
        data_mapping = {}
        for item in validated_data:
            if 'id' not in item or item['id'] == 0:
                item['id'] = - randint(1, 100000)
            data_mapping[item['id']] = item

        ret = []
        for record_id, data in data_mapping.items():
            item = material_mapping.get(record_id, None)
            if item is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(item, data))

        for record_id, item in material_mapping.items():
            if record_id not in data_mapping:
                item.delete()

        return ret


class ProdMaterialSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    materialId = serializers.IntegerField(source='id_material_id')
    materialName = serializers.CharField(source='id_material.name', required=False)
    total = serializers.FloatField()

    def create(self, validated_data):
        id_manufacture = int(self.context['id'])
        ProdMaterial.objects.create(
            id_manufacture_id=id_manufacture,
            id_material_id=validated_data['id_material_id'],
            total=validated_data['total']
        )

    def update(self, instance, validated_data):
        id_manufacture = int(self.context['id'])
        instance.id_manufacture_id = id_manufacture
        instance.id_material_id = validated_data['id_material_id']
        instance.total = validated_data['total']
        instance.save()

    class Meta:
        model = ProdMaterial
        fields = ('id', 'materialId', 'materialName', 'total')
        list_serializer_class = ProdMaterialListSerializer
