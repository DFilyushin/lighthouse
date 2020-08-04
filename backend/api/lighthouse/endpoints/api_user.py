from django.http import Http404
from django.contrib.auth.models import User, Group
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from lighthouse.serializers.serializer_user import UserListSerializer, GroupListSerializer, UserSerializer, NewUserSerializer
from rest_framework.response import Response


class UserView(viewsets.ModelViewSet):
    """
    Список пользователей
    """
    permission_classes = [IsAuthenticated]

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
        return Response({'message': 'Пользователь успешно создан'}, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='check', detail=False, url_name='checkLoginExists')
    def check_user_exists(self, request):
        user_param = request.GET.get('login', None)
        if not user_param:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            User.objects.get(username=user_param)
            return Response(data={'message': 'User exist'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(data={'message': 'Not found'}, status=status.HTTP_200_OK)


class GroupView(viewsets.ModelViewSet):
    """
    Список групп
    """
    queryset = Group.objects.all()
    serializer_class = GroupListSerializer
    permission_classes = [IsAuthenticated]
