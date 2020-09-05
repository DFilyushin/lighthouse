from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from lighthouse.appmodels.manufacture import Formula
from lighthouse.serializers.serializer_manufacture import FormulaSerializer, CalculationRawsResponseSerializer
from lighthouse.serializers.serializer_formula import NewFormulaSerializer, FormulaListSerializer
from rest_framework.permissions import IsAuthenticated


class FormulaViewSet(viewsets.ModelViewSet):
    """
    Рецептура
    """
    serializer_class = FormulaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.action == 'list':
            show_non_active: bool = self.request.GET.get('show_non_active', False)
            search = self.request.GET.get('search', None)
            if show_non_active:
                queryset = Formula.objects.all()
            else:
                queryset = Formula.objects.filter(is_active=True)
            if search:
                queryset = queryset.filter(id_product__name__icontains=search)
            return queryset.order_by('id_product__name').values('id', 'id_product__name', 'calc_amount', 'created')
        else:
            return Formula.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return FormulaListSerializer
        elif self.action == 'create' or self.action == 'update':
            return NewFormulaSerializer
        else:
            return FormulaSerializer

    @action(methods=['get'], detail=True, url_path='calc', url_name='calculation')
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
