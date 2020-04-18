from rest_framework import viewsets, mixins
from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import filters
from .serializer_sales import *


class ClientViewSet(viewsets.ModelViewSet):
    """
    Клиент
    """
    queryset = Client.objects.filter(deleted=False)
    serializer_class = ClientSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            client = Client.objects.get(pk=kwargs.get('pk', 0))
            client.deleted = True  # datetime.today()
            client.save()
            return Response(status=status.HTTP_200_OK)
        except Client.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class ClientList(generics.ListCreateAPIView):
    queryset = Client.objects.filter(deleted=False)
    serializer_class = ClientListSerializer
    search_fields = ['clientname']
    filter_backends = (filters.SearchFilter,)
