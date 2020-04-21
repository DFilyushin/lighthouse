from datetime import datetime
from rest_framework.decorators import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets, mixins
from rest_framework import generics
from rest_framework import filters
from rest_framework.decorators import action
from lighthouse.appmodels.manufacture import *
from .serializer_domain import *
from .serializer_manufacture import *


class ProductionLineView(viewsets.ModelViewSet):
    """
    Производственные линии
    """
    queryset = ProductionLine.objects.all()
    serializer_class = ProductLineSerializer


class ProductionView(viewsets.ModelViewSet):
    """
    Прозводственные карты
    """

    def get_queryset(self):
        product = self.request.GET.get('product', None)
        state = self.request.GET.get('state', None)
        start_period = self.request.GET.get('startPeriod', None)
        end_period = self.request.GET.get('endPeriod', None)
        if start_period and not end_period:
            end_period = datetime.today().strftime('%d-%m-%Y')
        queryset = Manufacture.objects.filter(is_delete=False)
        if product is not None:
            queryset = queryset.filter(id_formula__id_product=product)
        if state is not None:
            queryset = queryset.filter(cur_state=state)
        if start_period:
            date_start = datetime.strptime(start_period, '%d-%m-%Y')
            date_end = datetime.strptime(end_period, '%d-%m-%Y')
            queryset = queryset.filter(prod_start__range=(date_start, date_end))
        return queryset

    def destroy(self, request, *args, **kwargs):
        """
        Псевдоудаление записи
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        try:
            manufacture = Manufacture.objects.get(pk=kwargs.get('pk', 0))
            manufacture.is_delete = True  # datetime.today()
            manufacture.save()
            return Response(status=status.HTTP_200_OK)
        except Manufacture.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get_serializer_class(self):
        # Выбор сериализатора
        if self.action == 'list':
            return ManufactureListSerializer
        else:
            return ManufactureSerializer

    @action(methods=['get'], url_path='by_product/(?P<product_id>[0-9]+)', detail=False, url_name='by_product')
    def by_product(self, request, product_id):
        """
        Получить карты по выбранному продукту
        """
        manufacture = Manufacture.objects.filter(id_formula__id_product=product_id).filter(is_delete=False)
        serializer = ManufactureListSerializer(manufacture, many=True)
        return Response(serializer.data)


    @action(methods=['get', 'post', 'put'], detail=True, url_path='team', url_name='team')
    def get_team(self, request, pk):
        """
        Получить смену для производственной карты
        :param request:
        :param pk: Код производственной карты
        :return: Массив сотрудников в смене
        """
        if request.method == 'GET':
            manufacture = Manufacture.objects.get(id=int(pk))
            prod_team = ProdTeam.objects.filter(id_manufacture=manufacture)
            serializer = ProdTeamSerializer(prod_team, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = ProdTeamSerializer(data=request.data, many=True)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': serializer.errors})

    @action(methods=['get', 'post', 'put'], detail=True, url_path='calc', url_name='calc')
    def get_calc(self, request, pk):
        """
        Получить действительную калькуляцию на производственную карту
        :param request:
        :param pk: Код производственной карты
        :return: Массив сырья с массовой долью
        """
        if request.method == 'GET':
            manufacture = Manufacture.objects.get(id=int(pk))
            prod_calc = ProdCalc.objects.filter(id_manufacture=manufacture)
            serializer = ProdCalcRawsSerializer(prod_calc, many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = ProdCalcRawsSerializer(data=request.data, many=True)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': serializer.errors})
        elif request.method == 'PUT':
            prod_calcs = ProdCalc.objects.filter(id_manufacture_id=int(pk))
            serializer = ProdCalcRawsSerializer(instance=prod_calcs, data=request.data, many=True)
            if serializer.is_valid():
                serializer.save()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': serializer.errors})