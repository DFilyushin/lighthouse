from rest_framework.decorators import api_view, permission_classes, APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, mixins
from .serializers import *
from .appmodels.manufacture import Material, Tare, Formula
from .appmodels.org import Employee
from .appmodels.sales import Client
from rest_framework import generics
from rest_framework import filters


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hello(request):
    content = {
        'message': 'Hello, World!',
        'user': request.user.username
    }
    return Response(content)

# class OrgViewSet(mixins.RetrieveModelMixin,
#                     mixins.UpdateModelMixin,
#                     viewsets.GenericViewSet,
#                  ):
#     serializer_class = OrgSerializer
#
#
#     def get_queryset(self):
#         return Org.objects.filter(id=1)


class OrgViewSet(APIView, mixins.UpdateModelMixin):
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


class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.filter(id_type__id=1).all().order_by('name')
    serializer_class = ProductSerializer


class RawViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.filter(id_type__id=2).all().order_by('name')
    serializer_class = RawSerializer


class TareViewSet(viewsets.ModelViewSet):
    queryset = Tare.objects.all().order_by('name')
    serializer_class = TareSerializer


class FormulaViewSet(viewsets.ModelViewSet):
    serializer_class = FormulaSerializer

    def get_queryset(self):
        show_non_active: bool = self.request.GET.get('show_non_active', False)
        if show_non_active:
            return Formula.objects.all()
        else:
            return Formula.objects.filter(is_active=True).all()


class EmployeeActiveViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.filter(fired__isnull=True).order_by('fio')
    serializer_class = EmployeeSerializer


class ClientViewSet(viewsets.ModelViewSet):
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
