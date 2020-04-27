from builtins import staticmethod
from datetime import datetime
from django.db.models import Count, Sum
from django.db import IntegrityError
from rest_framework import viewsets, mixins, generics, views
from rest_framework import status
from rest_framework.response import Response
from .serializer_store import *
from .appmodels.store import Store
from .appmodels.manufacture import MATERIAL_PRODUCT_ID, MATERIAL_RAW_ID
from .api_utils import RoundFunc
from .api_errors import *


class ProductViewSet(viewsets.ModelViewSet):
    """
    Готовая продукция
    """
    queryset = Material.objects.filter(id_type__id=2).all().order_by('name')
    serializer_class = ProductSerializer


class RawViewSet(viewsets.ModelViewSet):
    """
    Сырьё
    """
    queryset = Material.objects.filter(id_type__id=1).all().order_by('name')
    serializer_class = RawSerializer


class TareViewSet(viewsets.ModelViewSet):
    """
    Тара
    """
    queryset = Tare.objects.all().order_by('name')
    serializer_class = TareSerializer


class FormulaViewSet(viewsets.ModelViewSet):
    """
    Рецептура
    """
    serializer_class = FormulaSerializer

    def get_queryset(self):
        show_non_active: bool = self.request.GET.get('show_non_active', False)
        if show_non_active:
            return Formula.objects.all()
        else:
            return Formula.objects.filter(is_active=True).all()

    def get_serializer_class(self):
        if self.action == 'list':
            return FormulaListSerializer
        else:
            return FormulaSerializer


class StoreTurnover(views.APIView):
    """
    Складские операции
    """
    @staticmethod
    def post(request):
        serializer = StoreTurnoverSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
            except Exception as e:
                print(str(e))
                data = {
                    'error': API_ERROR_POST_TURNOVER
                }
                return Response(data=data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def put(request):
        id = request.GET.get('id', None)
        if id is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        instance = Store.objects.get(id=id)
        serializer = StoreTurnoverSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update(instance=instance, validated_data=serializer.validated_data)
        return Response(status=status.HTTP_200_OK)


class RawStoreViewSet(views.APIView):
    """
    Состояние склада сырья
    """
    @staticmethod
    def get(request):
        on_date_data = request.GET.get('onDate', None)
        if on_date_data is None:
            on_date = datetime.today()
        else:
            on_date = datetime.strptime(on_date_data, '%d-%m-%Y')
        queryset = Store.objects\
            .filter(id_material__id_type__id=MATERIAL_RAW_ID)\
            .filter(oper_date__lte=on_date)\
            .filter(is_delete=False)\
            .values('id_material__id', 'id_material__name')\
            .annotate(total=RoundFunc(Sum('oper_value')))\
            .order_by('id_material__name')
        serializer = StoreRawSerializer(queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class ProductStoreViewSet(views.APIView):
    """
    Состояние склада готовой продукции
    """
    @staticmethod
    def get(request):
        on_date_data = request.GET.get('onDate', None)
        if on_date_data is None:
            on_date = datetime.today()
        else:
            on_date = datetime.strptime(on_date_data, '%d-%m-%Y')
        queryset = Store.objects\
            .filter(id_material__id_type__id=MATERIAL_PRODUCT_ID)\
            .filter(oper_date__lte=on_date)\
            .filter(is_delete=False)\
            .values('id_material__id', 'id_material__name')\
            .annotate(total=RoundFunc(Sum('oper_value')))\
            .order_by('id_material__name')
        serializer = StoreProductSerializer(queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class RefCostViewSet(viewsets.ModelViewSet):
    """
    Статьи затрат
    """
    serializer_class = RefCostSerializer

    def get_queryset(self):
        if self.action == 'list':
            return RefCost.objects.filter(id_parent__isnull=True)
        else:
            return RefCost.objects.all()


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    Затраты
    """
    queryset = Cost.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return ExpenseListSerializer
        else:
            return ExpenseSerializer

    def list(self, request, *args, **kwargs):
        start_date = request.GET.get('startDate', None)
        end_date = request.GET.get('endDate', None)
        id_cost = request.GET.get('idCost', None)
        if not start_date or not end_date:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        queryset = Cost.objects.filter(
            cost_date__range=(datetime.strptime(start_date, '%d-%m-%Y'), datetime.strptime(end_date, '%d-%m-%Y')))
        if id_cost:
            queryset = queryset.filter(id_cost_id=int(id_cost))
        serializer = ExpenseListSerializer(queryset.filter(is_delete=False), many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Удаление записи
        :param request:
        :param args:
        :param kwargs: id - Код записи
        :return:
        """
        try:
            expense = Cost.objects.get(id=kwargs.get('id', 0))
        except Cost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        expense.delete_cost()
        return Response(status=status.HTTP_200_OK)
