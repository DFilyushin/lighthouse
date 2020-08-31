from datetime import datetime
from rest_framework import viewsets, mixins, filters, status
from rest_framework.decorators import APIView, action
from rest_framework.response import Response
from lighthouse.appmodels.org import Org, Employee, Staff, Department
from lighthouse.serializers.serializer_domain import OrgSerializer, EmployeeSerializer, StaffSerializer, \
    DepartmentSerializer, EmployeeListSimpleSerializer
from lighthouse.serializers.serializer_manufacture import ProdTeamReportSerializer
from lighthouse.appmodels.manufacture import ProdTeam
from rest_framework.permissions import IsAuthenticated


class OrgViewSet(APIView, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    """
    Реквизиты предприятия
    """
    queryset = Org.objects.filter(id=1)
    serializer_class = OrgSerializer
    permission_classes = [IsAuthenticated]

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

    def delete(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    Подразделения предприятия
    """
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all().order_by('name')
    permission_classes = [IsAuthenticated]
    filter_backends = (filters.SearchFilter,)
    search_fields = ['name']


class StaffViewSet(viewsets.ModelViewSet):
    """
    Должности предприятия
    """
    serializer_class = StaffSerializer
    queryset = Staff.objects.all().order_by('name')
    permission_classes = [IsAuthenticated]
    filter_backends = (filters.SearchFilter,)
    search_fields = ['name']


class EmployeeView(viewsets.ModelViewSet):
    """
    Сотрудник
    """
    queryset = Employee.objects.filter(fired__isnull=True)
    search_fields = ['fio', 'tab_num']
    filter_backends = (filters.SearchFilter, )
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return EmployeeListSimpleSerializer
        else:
            return EmployeeSerializer

    def get_queryset(self):
        if self.action == 'list':
            # признак показа уволенных сотрудников
            hide_fired = not (True if self.request.GET.get('fired', None) == 'on' else False)
            queryset = Employee.objects.all()
            if hide_fired:
                queryset = queryset.filter(fired__isnull=True)
            return queryset.values('id', 'tab_num', 'fio', 'id_staff__name', 'fired')
        else:
            return Employee.objects.filter(fired__isnull=True)

    @action(methods=['get'], url_path='works', detail=True, url_name='employee_works')
    def get_works(self, request, pk):
        param_start_date = request.GET.get('start', None)
        param_end_date = request.GET.get('end', None)
        if not param_start_date or not param_end_date:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            start_date = datetime.strptime(param_start_date, '%Y-%m-%d')
            end_date = datetime.strptime(param_end_date, '%Y-%m-%d')
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = ProdTeam.objects.filter(id_employee_id=pk).filter(period_start__range=(start_date, end_date))
        serializer = ProdTeamReportSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['get'], url_path='noLogins', detail=False, url_name='employee_no_have_login')
    def no_login_employee(self, request):
        """Сотрудники без связи с учётными записями"""
        queryset = Employee.objects.filter(userId_id__isnull=True).values('id', 'tab_num', 'fio', 'id_staff__name')
        serializer = EmployeeListSimpleSerializer(queryset, many=True)
        return Response(serializer.data)
