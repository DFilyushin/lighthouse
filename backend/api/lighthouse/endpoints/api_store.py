from builtins import staticmethod
from django.db.models import Sum
from rest_framework import viewsets, views
from rest_framework.decorators import action
from lighthouse.serializers.serializer_store import *
from lighthouse.serializers.serializer_manufacture import *
from lighthouse.appmodels.store import Store
from lighthouse.appmodels.manufacture import MATERIAL_PRODUCT_ID, MATERIAL_RAW_ID
from rest_framework import filters
from .api_utils import RoundFunc
from .api_errors import *


class MaterialUnitViewSet(viewsets.ModelViewSet):
    """
    Единицы измерения
    """
    queryset = MaterialUnit.objects.all()
    serializer_class = MaterialUnitSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    Готовая продукция
    """
    queryset = Material.objects.filter(id_type__id=2).all().order_by('name')
    serializer_class = ProductSerializer
    search_fields = ['name']
    filter_backends = (filters.SearchFilter, )


class RawViewSet(viewsets.ModelViewSet):
    """
    Сырьё
    """
    queryset = Material.objects.filter(id_type__id=1).all().order_by('name')
    serializer_class = RawSerializer
    search_fields = ['name']
    filter_backends = (filters.SearchFilter, )


class TareViewSet(viewsets.ModelViewSet):
    """
    Тара
    """
    queryset = Tare.objects.all().order_by('name')
    serializer_class = TareSerializer
    search_fields = ['name']
    filter_backends = (filters.SearchFilter, )


class FormulaViewSet(viewsets.ModelViewSet):
    """
    Рецептура
    """
    serializer_class = FormulaSerializer

    def get_queryset(self):
        show_non_active: bool = self.request.GET.get('show_non_active', False)
        if show_non_active:
            return Formula.objects.all().order_by('id_product__name')
        else:
            return Formula.objects.filter(is_active=True).all().order_by('id_product__name')

    def get_serializer_class(self):
        if self.action == 'list':
            return FormulaListSerializer
        elif self.action == 'create' or self.action == 'update':
            return NewFormulaSerializer
        else:
            return FormulaSerializer

    @action(methods=['get'], detail=True, url_path='calc', url_name='calculatation')
    def calculation(self, request, pk):
        calc_count = float(request.GET.get('count', 0))
        try:
            formula = Formula.objects.get(id=pk)
        except Formula.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        queryset = formula.get_raws_calculate(calc_count)
        serializer = CalculationRawsResponseSerializer(queryset, many=True)
        json_data = {
            'idFormula': formula.id,
            'count': calc_count,
            'raws': serializer.data
        }
        return Response(status=status.HTTP_200_OK, data=json_data)


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
            on_date = datetime.strptime(on_date_data, '%Y-%m-%d')
        queryset = Store.objects\
            .filter(id_material__id_type__id=MATERIAL_RAW_ID)\
            .filter(oper_date__lte=on_date)\
            .filter(is_delete=False)\
            .values('id_material__id', 'id_material__name', 'id_tare__name', 'id_tare__id_unit__name', 'id_tare__v')\
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
            on_date = datetime.strptime(on_date_data, '%Y-%m-%d')
        queryset = Store.objects\
            .filter(id_material__id_type__id=MATERIAL_PRODUCT_ID)\
            .filter(oper_date__lte=on_date)\
            .filter(is_delete=False)\
            .values('id_material__id', 'id_material__name', 'id_tare__name', 'id_tare__id_unit__name', 'id_tare__v')\
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
        param_start_date = request.GET.get('startDate', None)
        param_end_date = request.GET.get('endDate', None)
        id_cost = request.GET.get('idCost', None)
        if not param_start_date or not param_end_date:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            start_date = datetime.strptime(param_start_date, '%Y-%m-%d')
            end_date = datetime.strptime(param_end_date, '%Y-%m-%d')
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        queryset = Cost.objects.filter(
            cost_date__range=(start_date, end_date))
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
        return Response(status=status.HTTP_204_NO_CONTENT)
