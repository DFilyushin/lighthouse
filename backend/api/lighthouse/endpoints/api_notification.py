from datetime import date, timedelta
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from lighthouse.appmodels.appsetup import UserSettings, AppSetup
from rest_framework import views, status
from lighthouse.appmodels.sales import Contract


class NotificationView(views.APIView):

    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request):
        notifications = []

        # Проверка изменения пароля
        settings = UserSettings.objects.get(user=request.user)
        life_password = AppSetup.objects.get(code='LIVE_PASSWORD').int_value
        if (date.today() - settings.last_password) > timedelta(days=life_password):
            notifications.append({'message': 'Давно не меняли пароль.', 'link': '/profile'})

        # Проверка группы пользователя
        groups = list(request.user.groups.values_list('name', flat=True))

        if 'manager' in groups:
            # Проверка оплат контрактов
            period_days = AppSetup.objects.get(code='NTF_UNPAID_DAYS').int_value
            start = date.today()
            end = start + timedelta(days=period_days)
            queryset = Contract.get_delivery_period_contract(start, end)
            for item in queryset:
                current_payment = item.get_paid_sum(start)
                plan_payment = item.get_plan_payment_sum(end)
                if plan_payment == 0:
                    # нет графика оплат, сравниваем с общей суммой контракта
                    contract_total_sum = item.get_total_sum()
                    is_problem = contract_total_sum < current_payment
                else:
                    # график платежей есть, общая сумма контракта меньше поступившей оплаты
                    is_problem = plan_payment > current_payment
                if is_problem:
                    item = {
                        'message': 'Контракт {} от {} нет оплат'.format(item.num, item.contract_date),
                        'link': '/contracts/{}'.format(item.id)
                    }
                    notifications.append(item)
        return Response(data=notifications, status=status.HTTP_200_OK)
