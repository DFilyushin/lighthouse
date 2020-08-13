from datetime import datetime
from rest_framework import viewsets, mixins, filters, status
from rest_framework.decorators import APIView, action
from rest_framework.response import Response
from lighthouse.appmodels.appsetup import AppSetup
from lighthouse.serializers.serializer_setup import AppSetupAllSerializer, AppSetupFloatSerializer, \
    AppSetupIntegerSerializer, AppSetupStringSerializer
from rest_framework.permissions import IsAuthenticated


class AppSetupViewSet(APIView):
    """
    Настройка приложения
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, code):
        """
        Получить настройку по коду
        :param request:
        :param code: Код настройки
        :return:
        """
        param_type = request.GET.get('type', None)
        setup = AppSetup.objects.get(code=code)
        if param_type == 'integer':
            serializer = AppSetupIntegerSerializer(instance=setup)
        elif param_type == 'string':
            serializer = AppSetupStringSerializer(instance=setup)
        elif param_type == 'float':
            serializer = AppSetupFloatSerializer(instance=setup)
        return Response(serializer.data)

    # FIXME Добавить обработчик ошибок
    # FIXME Добавить обработчик настройки даты/времени
    def put(self, request, code):
        """
        Обновление настройки по коду
        :param request:
        :param code: Код настройки
        :return:
        """
        param_type = request.GET.get('type', None)
        param_value = request.data.get('value', None)
        setup = AppSetup.objects.get(code=code)
        if param_type == 'float':
            setup.flo_value = float(param_value)
        elif param_type == 'string':
            setup.str_value = param_value
        elif param_type == 'integer':
            setup.int_value = int(param_value)
        setup.save()
        return Response(status=200)


class AppAllSetupViewSet(APIView):

    def get(self, request):
        setup = AppSetup.objects.all()
        serializer = AppSetupAllSerializer(instance=setup, many=True)
        return Response(serializer.data)

