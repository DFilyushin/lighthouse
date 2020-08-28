from django.http import Http404
from django.contrib.auth.models import User, Group
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from lighthouse.serializers.serializer_user import UserListSerializer, GroupListSerializer, UserSerializer, \
    NewUserSerializer
from rest_framework.response import Response
from lighthouse.appmodels.appsetup import UserSettings
from lighthouse.serializers.serializer_setup import UserSettingSerializer
from rest_framework import viewsets, views, status
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class UserPassView(views.APIView):
    """
    Смена пароля пользователя
    """
    permission_classes = [IsAuthenticated]

    @staticmethod
    def put(request, *args, **kwargs):
        try:
            new_pass = request.data['password']
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            validate_password(new_pass)
        except ValidationError as e:
            return Response(data={'message': e.messages}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(username=request.user)
        user.set_password(new_pass)
        user.save()
        return Response(status=status.HTTP_200_OK)


class ProfileView(views.APIView):
    """
    Профиль пользователя
    """
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request):
        """
        Получить профиль текущего пользователя
        :param request:
        :return: JSON response
        """
        queryset = UserSettings.objects.get(user=request.user)
        serializer = UserSettingSerializer(queryset)
        return Response(serializer.data)

    @staticmethod
    def put(request, *args, **kwargs):
        """
        Обновление профиля текущего пользователя
        :param request:
        :param args:
        :param kwargs:
        :return: JSON response
        """
        try:
            queryset = UserSettings.objects.get(user=request.user)
        except UserSettings.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSettingSerializer(data=request.data, instance=queryset)
        if serializer.is_valid():
            serializer.save()
            try:
                user = User.objects.get(username=request.user)
                user.email = serializer.validated_data['user']['email']
                user.first_name = serializer.validated_data['user']['first_name']
                user.last_name = serializer.validated_data['user']['last_name']
                user.save()
            except Exception as e:
                return Response(data={'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(data={'message': serializer.errors},  status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)


class UserView(viewsets.ModelViewSet):
    """
    Список пользователей
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return UserListSerializer
        elif self.action == 'create' or self.action == 'update':
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
        """
        Создать нового пользователя
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        serializer = NewUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)
        instance_serializer = UserSerializer(instance)
        return Response({'message': 'Пользователь успешно создан'}, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Обновление пользователя
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        login = kwargs['pk']
        user = User.objects.get(username=login)
        serializer = NewUserSerializer(data=request.data, instance=user)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_update(serializer)
        return Response(status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='check', detail=False, url_name='checkLoginExists')
    def check_user_exists(self, request):
        """
        Проверка существования логина
        :param request:
        :return:
        """
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
