from django.contrib.auth.models import User, Group
from rest_framework import serializers

from .serializer_domain import EmployeeListSerializer, Employee


class GroupListSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    description = serializers.SerializerMethodField()

    def get_description(self, obj):
        return obj.name

    class Meta:
        model = Group
        fields = ('name', 'description')


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
    login = serializers.CharField(max_length=80)
    firstName = serializers.CharField(max_length=255)
    lastName = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    isAdmin = serializers.BooleanField(default=False)
    groups = GroupListSerializer(many=True)
    employee = serializers.IntegerField(default=0)
    password = serializers.CharField(required=False)
    active = serializers.BooleanField(default=True)

    def create(self, validated_data):
        login = validated_data['login']
        first_name = validated_data['firstName']
        last_name = validated_data['lastName']
        email = validated_data['email']
        is_admin = validated_data['isAdmin']
        password = validated_data['password']
        groups = validated_data['groups']
        employee_id = validated_data['employee']

        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            if employee_id != 0:
                serializers.ValidationError({"employee": 'Неверно указан сотрудник!'})
        try:
            User.objects.get(username=login)
            raise serializers.ValidationError({"login": 'Пользователь с таким логином существует'})
        except User.DoesNotExist:
            user = User.objects.create(
                username=login,
                first_name=first_name,
                last_name=last_name,
                email=email,
                is_superuser=is_admin
            )
            user.set_password(password)
            user.save()
            employee.userId = user
            employee.save()
        for item in groups:
            group = Group.objects.get(name=item['name'])
            user.groups.add(group)
        return user

    def update(self, instance, validated_data):
        groups = validated_data['groups']
        new_password = validated_data.get('password', None)
        if new_password:
            instance.set_password(new_password)
        instance.login = validated_data['login']
        instance.email = validated_data['email']
        instance.first_name = validated_data['firstName']
        instance.last_name = validated_data['lastName']
        instance.is_superuser = validated_data['isAdmin']
        instance.is_active = validated_data['active']
        instance.save()

        instance.groups.clear()
        for item in groups:
            group = Group.objects.get(name=item['name'])
            instance.groups.add(group)
        return instance


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

    def update(self, instance, validated_data):
        actual = {item.name for item in instance.groups.all()}
        groups = {item['name'] for item in validated_data['groups']}

        instance.first_name = validated_data['first_name']
        instance.last_name = validated_data['last_name']
        instance.email = validated_data['email']
        instance.is_active = validated_data['is_active']
        instance.is_superuser = validated_data['is_superuser']
        instance.save()

        for item in actual.difference(groups):
            group_item = Group.objects.get(name=item)
            instance.groups.remove(group_item)

        for item in groups.difference(actual):
            group_item = Group.objects.get(name=item)
            instance.groups.add(group_item)

        return instance
