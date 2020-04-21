from rest_framework.decorators import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets, mixins
from rest_framework import generics
from rest_framework import filters
from .serializer_domain import *
from .serializer_store import *


class OrgViewSet(APIView, mixins.UpdateModelMixin):
    """
    Реквизиты предприятия
    """
    queryset = Org.objects.filter(id=1)
    serializer_class = OrgSerializer

    def get(self, request):
        org = Org.objects.get(pk=1)
        serializer = OrgSerializer(instance=org)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        instance = Org.objects.get(pk=1)
        serializer = OrgSerializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StaffViewSet(viewsets.ModelViewSet):
    """
    Должности предприятия
    """
    serializer_class = StaffSerializer
    queryset = Staff.objects.all()


class EmployeeView(viewsets.ModelViewSet):
    """
    Сотрудник
    """
    queryset = Employee.objects.filter(fired__isnull=True)
    search_fields = ['fio', 'tabNum']
    filter_backends = (filters.SearchFilter, )

    def get_serializer_class(self):
        if self.action == 'list':
            return EmployeeListSerializer
        else:
            return EmployeeSerializer
