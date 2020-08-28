from datetime import date, timedelta, datetime
from django.http import Http404
from django.contrib.auth.models import User, Group
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from lighthouse.serializers.serializer_user import UserListSerializer, GroupListSerializer, UserSerializer, \
    NewUserSerializer
from rest_framework.response import Response
from lighthouse.appmodels.appsetup import UserSettings, AppSetup
from lighthouse.serializers.serializer_setup import UserSettingSerializer
from rest_framework import viewsets, views, status
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class NotificationView(views.APIView):

    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request):
        notifications = []
        user = User.objects.get(username=request.user)
        life_password = AppSetup.objects.get(code='LIVE_PASSWORD').int_value
        if (datetime.now() - user.last_login) > timedelta(days=life_password):
            notifications.append({'message': 'Давно не меняли пароль.', 'link': '/profile'})

        return Response(data=notifications, status=status.HTTP_200_OK)

