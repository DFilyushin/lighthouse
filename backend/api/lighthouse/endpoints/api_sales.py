from datetime import datetime
from django.db.models import F, Sum
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from lighthouse.serializers.serializer_sales import ClientListSerializer, ClientSerializer, ContractListSerializer, \
    ContractSerializer, PaymentMethodSerializer, PaymentListSerializer, PaymentSerializer, ContractSimpleSerializer
from lighthouse.appmodels.sales import Contract, Payment, Client, ContractSpec, PaymentMethod, CONTRACT_STATE_ACTIVE


class ClientViewSet(viewsets.ModelViewSet):
    """
    Клиент
    """
    queryset = Client.objects.filter(deleted=False)
    search_fields = ['clientname']
    filter_backends = (filters.SearchFilter,)

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

    @action(methods=['get'], detail=True, url_path='contract', url_name='contract')
    def get_contracts(self, request, pk):
        """
        Контракты клиента
        :param request: Запрос
        :param pk: Код клиента
        :return: Массив контрактов клиента
        """
        if request.method == 'GET':
            # contracts = Contract.objects.filter(id_client_id=int(pk)).order_by('-contract_date')
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

    def destroy(self, request, *args, **kwargs):
        try:
            contract = Contract.objects.get(pk=kwargs.get('pk', 0))
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
            return ContractSpec.objects.filter(id_contract__deleted=False)\
                .values('id_contract__id', 'id_contract__num', 'id_contract__id_client__clientname',
                        'id_contract__contract_date', 'id_contract__est_delivery', 'id_contract__contract_state',
                        'id_contract__id_agent__fio')\
                .annotate(sum=Sum(F('item_price')*F('item_count')))
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


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """Методы платежей"""
    queryset =  PaymentMethod.objects.all()
    search_fields = ['name']
    filter_backends = (filters.SearchFilter, )
    serializer_class = PaymentMethodSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    """Оплаты по контрактам"""
    queryset = Payment.objects.all()

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
            return queryset.order_by('pay_date')
        else:
            return Payment.objects.all()
