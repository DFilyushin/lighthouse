from lighthouse.appmodels.appsetup import AppSetup
from rest_framework import serializers
from .serializer_user import GroupListSerializer

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


class UserSettingSerializer(serializers.Serializer):
    login = serializers.CharField(source='user.username')
    firstName = serializers.CharField(source='user.first_name')
    lastName = serializers.CharField(source='user.last_name')
    phone = serializers.CharField()
    mail = serializers.CharField(source='user.email')
    ntfPassword = serializers.BooleanField(source='ntf_password')
    ntfCtlContract = serializers.BooleanField(source='ntf_ctl_contract')
    ntfClaim = serializers.BooleanField(source='ntf_claim')
    ntfPayment = serializers.BooleanField(source='ntf_payment')
    groups = GroupListSerializer(source='user.groups', many=True, required=False)

    def update(self, instance, validated_data):
        instance.phone = validated_data['phone']
        instance.ntf_password = validated_data['ntf_password']
        instance.ntf_claim = validated_data['ntf_claim']
        instance.ntf_payment = validated_data['ntf_payment']
        instance.ntf_ctl_contract = validated_data['ntf_ctl_contract']
        instance.save()
        return instance
