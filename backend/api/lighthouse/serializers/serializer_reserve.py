from rest_framework import serializers
from lighthouse.appmodels.manufacture import Tare
from lighthouse.appmodels.store import Reservation


class ReservationListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    material = serializers.CharField(source='id_material__name')
    start = serializers.DateField(source='reserve_start')
    end = serializers.DateField(source='reserve_end')
    employee = serializers.CharField(source='id_employee__fio')
    contract = serializers.CharField(source='id_contract__id_client__clientname')
    tare = serializers.CharField(source='id_tare__name')
    tareV = serializers.FloatField(source='id_tare__v')
    value = serializers.FloatField(source='reserve_value')
    contractId = serializers.IntegerField(source='id_contract__id')

    class Meta:
        model = Reservation
        fields = ('id', 'start', 'end', 'value', 'material', 'employee', 'contract', 'tare', 'tareV', 'contractId')


class ContractReservationListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    material = serializers.CharField(source='id_material.name')
    start = serializers.DateField(source='reserve_start')
    end = serializers.DateField(source='reserve_end')
    employee = serializers.CharField(source='id_employee.fio')
    tare = serializers.CharField(source='id_tare.name')
    tareV = serializers.FloatField(source='id_tare.v')
    value = serializers.FloatField(source='reserve_value')
    contractId = serializers.IntegerField(source='id_contract.id')

    class Meta:
        model = Reservation
        fields = ('id', 'start', 'end', 'value', 'material', 'employee', 'tare', 'tareV', 'contractId')

