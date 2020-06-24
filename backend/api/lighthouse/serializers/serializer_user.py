from django.contrib.auth.models import User, Group
from rest_framework import serializers

from .serializer_domain import EmployeeListSerializer, Employee

class GroupListSerializer(serializers.ModelSerializer):
    name = serializers.CharField()

    class Meta:
        model = Group
        fields = ('name', )


class UserListSerializer(serializers.ModelSerializer):
    login = serializers.CharField(source='username')
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    email = serializers.CharField()
    active = serializers.BooleanField(source='is_active')
    joined = serializers.DateTimeField(source='date_joined')
    isAdmin = serializers.BooleanField(source='is_superuser')


    class Meta:
        model = User
        fields = ('login', 'firstName', 'lastName', 'email', 'active', 'joined', 'isAdmin')


class NewUserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=80)
    firstName = serializers.CharField(max_length=255)
    lastName = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    isAdmin = serializers.BooleanField(default=False)
    groups = GroupListSerializer(many=True)
    employee = EmployeeListSerializer(allow_null=True)
    password = serializers.CharField()

    def create(self, validated_data):
        login = validated_data['username']
        first_name = validated_data['firstName']
        last_name = validated_data['lastName']
        email = validated_data['email']
        is_admin = validated_data['isAdmin']
        password = validated_data['password']
        try:
            user = User.objects.get(username=login)
            raise serializers.ValidationError({"login": 'Пользователь с таким логином существует'})
        except User.DoesNotExist:
            user = User.objects.create(
                username=login,
                first_name=first_name,
                last_name=last_name,
                email=email,
                is_superuser=is_admin,
                password=password
            )
        return user


class UserSerializer(serializers.ModelSerializer):
    login = serializers.CharField(source='username')
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    email = serializers.CharField()
    active = serializers.BooleanField(source='is_active')
    isAdmin = serializers.BooleanField(source='is_superuser')
    joined = serializers.DateTimeField(source='date_joined', allow_null=True)
    lastLogin = serializers.DateTimeField(source='last_login', allow_null=True)
    groups = GroupListSerializer(many=True)
    employee = serializers.SerializerMethodField(source='get_employee')

    class Meta:
        model = User
        fields = ('login', 'firstName', 'lastName', 'email', 'active', 'joined', 'lastLogin',
                  'groups', 'employee', 'isAdmin')

    def get_employee(self, obj):
        try:
            value = Employee.objects.get(userId=obj)
        except Employee.DoesNotExist:
            value = None
        return EmployeeListSerializer(value).data
