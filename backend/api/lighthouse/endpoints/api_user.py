from django.http import Http404
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from lighthouse.serializers.serializer_user import UserListSerializer, GroupListSerializer, UserSerializer, NewUserSerializer
from rest_framework.response import Response
from rest_framework import status

class UserView(viewsets.ModelViewSet):
    """
    Список пользователей
    """
    def get_serializer_class(self):
        if self.action == 'list':
            return UserListSerializer
        elif self.action == 'create':
            return NewUserSerializer
        else:
            return UserSerializer

    def get_object(self):
        pk_param = self.kwargs.get('pk', None)
        try:
            return User.objects.get(username=pk_param)
        except User.DoesNotExist:
            raise Http404

    def get_queryset(self):
        queryset = User.objects.all()
        if self.action == 'list':
            active_param = self.request.GET.get('active', None)
            search_param = self.request.GET.get('search', None)
            if active_param:
                if active_param == 'on':
                    queryset = queryset.filter(is_active=True)
            if search_param:
                queryset = queryset.filter(username__startswith=search_param)
        return queryset.order_by('username')

    def create(self, request, *args, **kwargs):
        serializer = NewUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)
        instance_serializer = UserSerializer(instance)
        return Response({'Message': 'Пользователь успешно создан'}, status=status.HTTP_201_CREATED)


class GroupView(viewsets.ModelViewSet):
    """
    Список групп
    """
    queryset = Group.objects.all()
    serializer_class = GroupListSerializer
