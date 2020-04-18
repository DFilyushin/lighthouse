from rest_framework import viewsets, mixins
from .serializer_store import *


class ProductViewSet(viewsets.ModelViewSet):
    """
    Готовая продукция
    """
    queryset = Material.objects.filter(id_type__id=2).all().order_by('name')
    serializer_class = ProductSerializer


class RawViewSet(viewsets.ModelViewSet):
    """
    Сырьё
    """
    queryset = Material.objects.filter(id_type__id=1).all().order_by('name')
    serializer_class = RawSerializer


class TareViewSet(viewsets.ModelViewSet):
    """
    Тара
    """
    queryset = Tare.objects.all().order_by('name')
    serializer_class = TareSerializer


class FormulaViewSet(viewsets.ModelViewSet):
    """
    Рецептура
    """
    serializer_class = FormulaSerializer

    def get_queryset(self):
        show_non_active: bool = self.request.GET.get('show_non_active', False)
        if show_non_active:
            return Formula.objects.all()
        else:
            return Formula.objects.filter(is_active=True).all()

    def get_serializer_class(self):
        if self.action == 'list':
            return FormulaListSerializer
        else:
            return FormulaSerializer
