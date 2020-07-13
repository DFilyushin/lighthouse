from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from lighthouse.appmodels.manufacture import Formula
from lighthouse.serializers.serializer_manufacture import FormulaSerializer, CalculationRawsResponseSerializer
from lighthouse.serializers.serializer_formula import NewFormulaSerializer, FormulaListSerializer


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
