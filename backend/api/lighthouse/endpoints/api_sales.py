from datetime import datetime
from django.db.models import F, Sum
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from lighthouse.serializers.serializer_sales import ClientListSerializer, ClientSerializer, ContractListSerializer, \
    ContractSerializer, PaymentMethodSerializer, PaymentListSerializer, PaymentSerializer, ContractSimpleSerializer
from lighthouse.appmodels.sales import Contract, Payment, Client, ContractSpec, PaymentMethod, \
    CONTRACT_STATE_ACTIVE, CONTRACT_STATE_UNDEFINED, CONTRACT_STATE_READY
from .api_errors import API_ERROR_CARD_IS_CLOSE, api_error_response, API_ERROR_SAVE_DATA, API_ERROR_CONTRACT_IS_CLOSE


class ClientViewSet(viewsets.ModelViewSet):
    """
    Клиент
    """
    queryset = Client.objects.filter(deleted=False)
    search_fields = ['clientname']
    filter_backends = (filters.SearchFilter,)
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        try:
            client = Client.objects.get(pk=kwargs.get('pk', 0))
            client.deleted = True  # datetime.today()
            client.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Client.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get_serializer_class(self):
        # Выбор сериализатора
        if self.action == 'list':
            return ClientListSerializer
        else:
            return ClientSerializer

    def get_queryset(self):
        if self.action == 'list':
            return Client.objects.filter(deleted=False).values('id', 'clientname', 'addr_reg', 'id_agent__fio', 'contact_employee')
        else:
            return Client.objects.filter(deleted=False)

    @action(methods=['get'], detail=False, url_path='byContract/(?P<contract_id>\d+)', url_name='by_contract')
    def get_client_by_contract(self, request, contract_id):
        contract = Contract.objects.get(pk=contract_id)
        client = Client.objects.get(pk=contract.id_client_id)
        serializer = ClientSerializer(client, many=False)
        return Response(serializer.data)

    @action(methods=['get'], detail=True, url_path='contract', url_name='contract')
    def get_contracts(self, request, pk):
        """
        Контракты клиента
        :param request: Запрос
        :param pk: Код клиента
        :return: Массив контрактов клиента
        """
        if request.method == 'GET':
            contracts = ContractSpec.objects.filter(id_contract__id_client_id=pk)\
                .values('id_contract__id', 'id_contract__num', 'id_contract__id_client__clientname',
                        'id_contract__contract_date', 'id_contract__est_delivery', 'id_contract__id_agent__fio',
                        'id_contract__contract_state')\
                .annotate(sum=Sum(F('item_price')*F('item_count')))
            serializer = ContractListSerializer(contracts, many=True)
            return Response(serializer.data)


class ContractViewSet(viewsets.ModelViewSet):
    """Контракт"""
    queryset = Contract.objects.filter(deleted=False)
    search_fields = ['num']
    filter_backends = (filters.SearchFilter,)
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        try:
            contract = Contract.objects.get(pk=kwargs.get('pk', 0))
            if contract.contract_state == CONTRACT_STATE_READY:
                return api_error_response(API_ERROR_CONTRACT_IS_CLOSE)
            contract.deleted = True
            contract.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Contract.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get_serializer_class(self):
        if self.action == 'list':
            return ContractListSerializer
        else:
            return ContractSerializer

    def get_queryset(self):
        if self.action == 'list':
            param_state = int(self.request.GET.get('state', CONTRACT_STATE_UNDEFINED))
            queryset = Contract.objects.filter(deleted=False)
            if param_state != CONTRACT_STATE_UNDEFINED:
                queryset = queryset.filter(contract_state=param_state)
            return queryset.values('id', 'num', 'id_client__clientname', 'contract_date', 'est_delivery', 'contract_state',
                                   'id_agent__fio')\
                .annotate(sum=Sum(F('specs__item_price')*F('specs__item_count')))
        else:
            return Contract.objects.filter(deleted=False)

    @action(methods=['get'], detail=False, url_path='active', url_name='active_contract')
    def get_active_contracts(self, request):
        """Активные контракты"""
        param_find = request.GET.get('num', None)
        if param_find:
            contracts = Contract.objects.filter(contract_state=CONTRACT_STATE_ACTIVE).\
                filter(num__istartswith=param_find).order_by('contract_date')
            serializer = ContractSimpleSerializer(contracts, many=True)
            return Response(serializer.data)
        else:
            return Response([])

    @action(methods=['post'], detail=True, url_path='setStatus/(?P<new_status>[0-9]+)', url_name='setStatus')
    def set_contract_status(self, request, pk, new_status: int):
        """
        Установить статус контракта
        :param request:
        :param pk: Код контракта
        :param new_status: Новый статус контракта
        :return: Success - OK (200), NotFound - 404
        """
        try:
            contract = Contract.objects.get(pk=pk)
        except Contract.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            param_new_status = int(new_status)
            contract.set_contract_status(param_new_status)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return api_error_response(API_ERROR_SAVE_DATA.format(str(e)))


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """Методы платежей"""
    queryset = PaymentMethod.objects.all()
    search_fields = ['name']
    filter_backends = (filters.SearchFilter, )
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]


class PaymentViewSet(viewsets.ModelViewSet):
    """Оплаты по контрактам"""
    queryset = Payment.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return PaymentListSerializer
        else:
            return PaymentSerializer

    def get_queryset(self):
        if self.action == 'list':
            param_start_period = self.request.GET.get('start', None)
            param_end_period = self.request.GET.get('end', None)
            param_method = self.request.GET.get('method')

            date_start = datetime.strptime(param_start_period, '%Y-%m-%d')
            date_end = datetime.strptime(param_end_period, '%Y-%m-%d')
            queryset = Payment.objects.filter(pay_date__range=(date_start, date_end))

            if param_method:
                queryset = queryset.filter(pay_type_id=int(param_method))
            return queryset.order_by('pay_date')\
                .only('id', 'id_contract', 'pay_date', 'pay_num', 'pay_type', 'pay_value')
        else:
            return Payment.objects.all()
