from django.db.models import Q, F, ExpressionWrapper, Sum, FloatField
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework import filters
from rest_framework.decorators import action
from lighthouse.serializers.serializer_sales import *
from lighthouse.appmodels.sales import *


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


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """Методы платежей"""
    queryset =  PaymentMethod.objects.all()
    search_fields = ['name']
    filter_backends =  (filters.SearchFilter, )
    serializer_class = PaymentMethodSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    """Оплаты по контрактам"""
    queryset = Payment.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return PaymentListSerializer
