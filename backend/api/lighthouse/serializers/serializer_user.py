from django.contrib.auth.models import User, Group
from rest_framework import serializers


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


    class Meta:
        model = User
        fields = ('login', 'firstName', 'lastName', 'email', 'active', 'joined')


class UserSerializer(serializers.ModelSerializer):
    login = serializers.CharField(source='username')
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')
    email = serializers.CharField()
    active = serializers.BooleanField(source='is_active')
    joined = serializers.DateTimeField(source='date_joined')
    lastLogin = serializers.DateTimeField(source='last_login')
    groups = GroupListSerializer(many=True)

    class Meta:
        model = User
        fields = ('login', 'firstName', 'lastName', 'email', 'active', 'joined', 'lastLogin', 'groups')
