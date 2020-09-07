from rest_framework import serializers
from lighthouse.appmodels.sales import PriceList
from .serializer_domain import EmployeeListSerializer


class PriceListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    productId = serializers.IntegerField(source='id_product__id')
    productName = serializers.CharField(source='id_product__name')
    tareId = serializers.IntegerField(source='id_tare__id')
    tareName = serializers.CharField(source='id_tare__name')
    tareV = serializers.FloatField(source='id_tare__v')
    date = serializers.DateField(source='on_date')
    price = serializers.FloatField()

    class Meta:
        model = PriceList
        fields = ['id', 'productId', 'productName', 'date', 'price', 'tareId', 'tareName', 'tareV']


class PriceListItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    employee = EmployeeListSerializer(source='id_employee', required=False, allow_null=True)
    productId = serializers.IntegerField(source='id_product.id')
    productName = serializers.CharField(source='id_product.name')
    tareId = serializers.IntegerField(source='id_tare.id')
    tareName = serializers.CharField(source='id_tare.name')
    tareV = serializers.FloatField(source='id_tare.v')
    date = serializers.DateField(source='on_date')
    price = serializers.FloatField()

    def update(self, instance, validated_data):
        if validated_data['id_employee']:
            instance.id_employee_id = validated_data['id_employee']['id']
        else:
            instance.id_employee = None
        instance.id_product_id = validated_data['id_product']['id']
        instance.id_tare_id = validated_data['id_tare']['id']
        instance.on_date = validated_data['on_date']
        instance.price = validated_data['price']
        instance.save()
        return instance

    def create(self, validated_data):
        employee = None
        if validated_data['id_employee']:
            employee = validated_data['id_employee']['id']
        price = PriceList.objects.create(
            id_product_id=validated_data['id_product']['id'],
            id_tare_id=validated_data['id_tare']['id'],
            on_date=validated_data['on_date'],
            price=validated_data['price'],
            id_employee_id=employee
        )
        return price

    class Meta:
        model = PriceList
        fields = ['id', 'productId', 'productName', 'tareId', 'tareName', 'tareV', 'date', 'price', 'employee']
