from lighthouse.appmodels.appsetup import AppSetup
from rest_framework import serializers


class AppSetupStringSerializer(serializers.ModelSerializer):
    code = serializers.CharField()
    name = serializers.CharField()
    value = serializers.CharField(source='str_value')

    class Meta:
        model = AppSetup
        fields = ['code', 'name', 'value']


class AppSetupIntegerSerializer(serializers.ModelSerializer):
    code = serializers.CharField()
    name = serializers.CharField()
    value = serializers.IntegerField(source='int_value')

    class Meta:
        model = AppSetup
        fields = ['code', 'name', 'value']


class AppSetupFloatSerializer(serializers.ModelSerializer):
    code = serializers.CharField()
    name = serializers.CharField()
    value = serializers.IntegerField(source='flo_value')

    class Meta:
        model = AppSetup
        fields = ['code', 'name', 'value']


class AppSetupAllSerializer(serializers.ModelSerializer):
    code = serializers.CharField()
    name = serializers.CharField()
    kind = serializers.CharField()
    intValue = serializers.IntegerField(source='int_value')
    strValue = serializers.CharField(source='str_value')
    floValue = serializers.FloatField(source='flo_value')
    dateValue = serializers.DateTimeField(source='date_value')

    class Meta:
        model = AppSetup
        fields = ['code', 'name', 'kind', 'intValue', 'strValue', 'floValue', 'dateValue']
