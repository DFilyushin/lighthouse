from datetime import datetime
from builtins import staticmethod
from django.db.models import Sum, Q, Exists, OuterRef
from rest_framework import viewsets, views, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from lighthouse.appmodels.store import MaterialUnit, Material, Tare, RefCost, Cost
from lighthouse.serializers.serializer_refs import MaterialUnitSerializer
from lighthouse.serializers.serializer_store import TareSerializer, StoreTurnoverSerializer, \
    StoreRawSerializer, StoreProductSerializer, RefCostSerializer, RefCostFlatSerializer, \
    ExpenseListSerializer, ExpenseSerializer, StoreJournalItemSerializer, \
    StoreJournalSerializer, StoreArrivalSerializer, ReservationSerializer, MaterialSerializer
from lighthouse.serializers.serializer_reserve import ReservationListSerializer
from lighthouse.serializers.serializer_manufacture import ProductSerializer, RawSerializer
from lighthouse.serializers.serializer_product import StockSerializer
from lighthouse.appmodels.store import Store, Reservation
from lighthouse.appmodels.manufacture import MATERIAL_PRODUCT_ID, MATERIAL_RAW_ID, MATERIAL_STOCK_ID
from rest_framework.decorators import action
from rest_framework.response import Response
from .api_utils import RoundFunc
from .api_errors import API_ERROR_POST_TURNOVER


class MaterialViewSet(viewsets.ModelViewSet):
    """
    Материал
    """
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    search_fields = ['name']
    filter_backends = (filters.SearchFilter,)
    permission_classes = [IsAuthenticated]


class MaterialUnitViewSet(viewsets.ModelViewSet):
    """
    Единицы измерения
    """
    queryset = MaterialUnit.objects.all()
    serializer_class = MaterialUnitSerializer
    search_fields = ['name']
    filter_backends = (filters.SearchFilter,)
    permission_classes = [IsAuthenticated]


class ProductViewSet(viewsets.ModelViewSet):
    """
    Готовая продукция
    """
    queryset = Material.objects.filter(id_type__id=MATERIAL_PRODUCT_ID).all().order_by('name')
    serializer_class = ProductSerializer
    search_fields = ['name']
    filter_backends = (filters.SearchFilter,)
    permission_classes = [IsAuthenticated]


class RawViewSet(viewsets.ModelViewSet):
    """
    Сырьё
    """
    queryset = Material.objects.filter(id_type__id=MATERIAL_RAW_ID).all().order_by('name')
    serializer_class = RawSerializer
    search_fields = ['name']
    filter_backends = (filters.SearchFilter,)
    permission_classes = [IsAuthenticated]


class StockViewSet(viewsets.ModelViewSet):
    """
    ТМЗ
    """
    queryset = Material.objects.filter(id_type_id=MATERIAL_STOCK_ID).all().order_by('name')
    serializer_class = StockSerializer
    search_fields = ['name']
    filter_backends = (filters.SearchFilter,)
    permission_classes = [IsAuthenticated]


class TareViewSet(viewsets.ModelViewSet):
    """
    Тара
    """
    queryset = Tare.objects.all().order_by('name')
    serializer_class = TareSerializer
    search_fields = ['name']
    filter_backends = (filters.SearchFilter,)
    permission_classes = [IsAuthenticated]


class StoreTurnoverMaterial(views.APIView):
    """
    Движение материала на складе
    """
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request):
        serializer = StoreArrivalSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
            except Exception as e:
                print(str(e))
                data = {
                    'message': API_ERROR_POST_TURNOVER,
                    'detail': str(e)
                }
                return Response(data=data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StoreTurnover(views.APIView):
    """
    Складские операции
    """
    permission_classes = [IsAuthenticated]

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


class StoreJournalViewSet(viewsets.ModelViewSet):
    """
    Складской журнал
    """
    serializer_class = StoreJournalSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return StoreJournalSerializer
        else:
            return StoreJournalItemSerializer

    def get_queryset(self):
        if self.action == 'list':
            param_oper_type = self.request.GET.get('type', None)
            param_start_date = self.request.GET.get('startPeriod', None)
            param_end_date = self.request.GET.get('endPeriod', None)
            param_material_type = self.request.GET.get('material', None)
            try:
                oper_type = int(param_oper_type)
            except (ValueError, TypeError):
                oper_type = -1
            try:
                material_type = int(param_material_type)
            except (ValueError, TypeError):
                material_type = -1
            if param_start_date is None or param_end_date is None:
                raise ValidationError
            try:
                start_date = datetime.strptime(param_start_date, '%Y-%m-%d')
                end_date = datetime.strptime(param_end_date, '%Y-%m-%d')
            except ValueError:
                raise ValidationError
            queryset = Store.objects.filter(oper_date__range=(start_date, end_date))
            if param_oper_type is not None and oper_type != -1:
                queryset = queryset.filter(oper_type=oper_type)
            if param_material_type is not None and material_type != -1:
                queryset = queryset.filter(id_material__id_type__id=material_type)
            return queryset.filter(is_delete=False).order_by('-oper_date') \
                .values('id', 'id_material__name', 'id_tare__name', 'oper_date', 'oper_type', 'oper_value',
                        'oper_price', 'id_manufacture_id', 'id_cost_id', 'id_tare__v')
        elif self.action == 'retrieve':
            return Store.objects.filter(is_delete=False)


class RawStoreViewSet(views.APIView):
    """
    Состояние склада сырья
    """
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request):
        on_date_data = request.GET.get('onDate', None)
        search = request.GET.get('search', None)
        if on_date_data is None:
            on_date = datetime.today()
        else:
            on_date = datetime.strptime(on_date_data, '%Y-%m-%d')
        queryset = Store.objects \
            .filter(id_material__id_type__id=MATERIAL_RAW_ID) \
            .filter(oper_date__lte=on_date) \
            .filter(is_delete=False)
        if search:
            queryset = queryset.filter(id_material__name__icontains=search)
        queryset = queryset \
            .values('id_material__id', 'id_material__name', 'id_tare__name', 'id_tare__id_unit__name', 'id_tare__v') \
            .annotate(total=RoundFunc(Sum('oper_value'))) \
            .order_by('id_material__name')
        serializer = StoreRawSerializer(queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class StoreByMaterialViewSet(views.APIView):
    """
    Складские движения по выбранному материалу
    """
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, material):
        on_date_data = request.GET.get('onDate', None)
        if on_date_data is None:
            on_date = datetime.today()
        else:
            on_date = datetime.strptime(on_date_data, '%Y-%m-%d')
        queryset = Store.objects \
            .filter(id_material__id=material) \
            .filter(oper_date__lte=on_date) \
            .filter(is_delete=False)
        queryset = queryset \
            .values('id_material__id', 'id_material__name', 'id_tare__name', 'id_tare__id_unit__name', 'id_tare__v',
                    'oper_value', 'oper_type', 'oper_date', 'oper_price', 'id') \
            .order_by('-oper_date')
        serializer = StoreJournalSerializer(queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class ProductStoreViewSet(views.APIView):
    """
    Состояние склада готовой продукции
    """
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request):
        on_date_data = request.GET.get('onDate', None)
        search = request.GET.get('search', None)
        if on_date_data is None:
            on_date = datetime.today()
        else:
            on_date = datetime.strptime(on_date_data, '%Y-%m-%d')
        queryset = Store.objects \
            .filter(id_material__id_type__id=MATERIAL_PRODUCT_ID) \
            .filter(oper_date__lte=on_date) \
            .filter(is_delete=False)
        if search:
            queryset = queryset.filter(id_material__name__icontains=search)
        queryset = queryset \
            .values('id_material__id', 'id_material__name', 'id_tare__name', 'id_tare__id_unit__name', 'id_tare__v') \
            .annotate(total=RoundFunc(Sum('oper_value'))) \
            .order_by('id_material__name')
        serializer = StoreProductSerializer(queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class StockStoreViewSet(views.APIView):
    """
    Состояние склада ТМЦ
    """
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request):
        on_date_data = request.GET.get('onDate', None)
        search = request.GET.get('search', None)
        if on_date_data is None:
            on_date = datetime.today()
        else:
            on_date = datetime.strptime(on_date_data, '%Y-%m-%d')
        queryset = Store.objects \
            .filter(id_material__id_type__id=MATERIAL_STOCK_ID) \
            .filter(oper_date__lte=on_date) \
            .filter(is_delete=False)
        if search:
            queryset = queryset.filter(id_material__name__icontains=search)
        queryset = queryset \
            .values('id_material__id', 'id_material__name', 'id_tare__name', 'id_tare__id_unit__name', 'id_tare__v') \
            .annotate(total=RoundFunc(Sum('oper_value'))) \
            .order_by('id_material__name')
        serializer = StoreProductSerializer(queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)


class RefCostViewSet(viewsets.ModelViewSet):
    """
    Статьи затрат
    """
    serializer_class = RefCostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.action == 'list':
            return RefCost.objects.filter(id_parent__isnull=True)
        else:
            return RefCost.objects.all()

    @action(methods=['get'], detail=False, url_path='flat', url_name='flat')
    def get_flat_list(self, request):
        cost = RefCost.objects.filter(id_parent__isnull=False).filter(~Q(id_parent_id=0)) | RefCost.objects.filter(
            id_parent__isnull=True) \
            .filter(~Exists(RefCost.objects.filter(id_parent_id=OuterRef('pk'))))
        serializer = RefCostFlatSerializer(cost, many=True)
        return Response(serializer.data)


class ReservationViewSet(viewsets.ModelViewSet):
    """
    Резервирование продукции
    """
    queryset = Reservation.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return ReservationListSerializer
        else:
            return ReservationSerializer

    def get_queryset(self):
        if self.action == 'list':
            search = self.request.GET.get('search', None)
            queryset = Reservation.objects. \
                filter(reserve_end__gte=datetime.today(), reserve_start__lte=datetime.today(),
                       id_contract__deleted=False)
            if search:
                queryset = queryset.filter(
                    Q(id_material__name__icontains=search) | Q(id_contract__id_client__clientname__icontains=search))
            queryset = queryset.values(
                'id', 'reserve_start', 'reserve_end', 'reserve_value', 'id_material__name', 'id_tare__v',
                'id_tare__name', 'id_employee__fio', 'id_contract__id_client__clientname', 'id_contract__id')
            return queryset
        else:
            return Reservation.objects.all()


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    Затраты
    """
    queryset = Cost.objects.all()
    permission_classes = [IsAuthenticated]

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
        queryset = queryset.filter(is_delete=False).values('id', 'id_cost__name', 'cost_date', 'total')
        serializer = ExpenseListSerializer(queryset, many=True)
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Удаление записи
        :param request:
        :param args:
        :param kwargs: id - Код записи
        :return:
        """
        id_record = int(kwargs.get('pk', 0))
        try:
            expense = Cost.objects.get(id=id_record)
        except Cost.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        expense.delete_cost()
        return Response(status=status.HTTP_204_NO_CONTENT)
