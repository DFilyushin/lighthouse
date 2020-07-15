from django.db.models import F, Sum
from django.db.models.functions import Coalesce
from rest_framework import status
from lighthouse.appmodels.sales import ContractSpec
from rest_framework.decorators import api_view
from rest_framework.response import Response


def get_contract_total(year: int, month: int) -> float:
    """
    Запрос на получение данных контракта по выбранному месяцу
    Рассчёт учитываетс скидку
    Результат округляется до 2 символов
    """
    result = ContractSpec.objects.filter(id_contract__contract_date__year=year)\
        .filter(id_contract__contract_date__month=month)\
        .aggregate(sum=Coalesce(Sum(F('item_price')*F('item_count') - F('item_price')*F('item_count')*F('item_discount')/100),0))
    return round(result['sum'], 2)


@api_view(['GET', 'POST'])
def stat_contract(request):
    """
    Статистика по контрактам за месяц
    Рассчитывается как сумма всех заключенных контрактов
    Сравнивается с суммой заключенных контрактов прошлого месяца
    """
    year_param = request.GET.get('year', None)
    month_param = request.GET.get('month', None)
    if not year_param or not month_param:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    try:
        year = int(year_param)
        month = int(month_param)
    except ValueError:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    if month > 12 or month < 1:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    old_year = year
    if month == 1:
        old_month = 12
        old_year = year - 1
    else:
        old_month = month-1

    current_month = get_contract_total(year, month)
    prev_month = get_contract_total(old_year, old_month)
    if prev_month == 0:
        if current_month > 0:
            value = 100
        else:
            value = 0
    else:
        value = -round((prev_month - current_month) * 100 / prev_month, 2)

    data = {
        "prev": prev_month,
        "current": current_month,
        "diff": value
    }
    return Response(data)
