from django.db import models
from django.contrib.auth.models import User
from lighthouse.appmodels.org import Employee
from lighthouse.appmodels.manufacture import Material


class AppSetup(models.Model):
    """
    Настройки приложения
    """
    code = models.CharField(max_length=20, null=False, blank=False, unique=True, verbose_name='Код настройки')
    name = models.CharField(max_length=255, default='', null=False, blank=True, verbose_name='Описание')
    kind = models.CharField(max_length=4, null=True, blank=True, verbose_name='Тип настройки')
    int_value = models.IntegerField(default=0, verbose_name='Числовое значение')
    flo_value = models.FloatField(default=0, verbose_name='Точное значение')
    str_value = models.CharField(max_length=255, null=True, blank=True, verbose_name='Строковое значение')
    date_value = models.DateTimeField(null=True, verbose_name='Дата/время')

    def __str__(self):
        return '{} {}'.format(self.name, self.kind)

    class Meta:
        verbose_name = 'Настройка приложения'
        verbose_name_plural = 'Настройки приложения'
        ordering = ['name']


class UserSettings(models.Model):
    """
    Настройки пользователя
    """
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE, verbose_name='Пользователь')
    last_password = models.DateField(null=True, verbose_name='Дата смены пароля')
    phone = models.CharField(max_length=15, null=True, blank=True, verbose_name='Телефон')
    ntf_password = models.BooleanField(default=True, verbose_name='Устаревший пароль')
    ntf_ctl_contract = models.BooleanField(default=True, verbose_name='Контроль контракта')
    ntf_claim = models.BooleanField(default=True, verbose_name='Контроль претензионной работы')
    ntf_payment = models.BooleanField(default=True, verbose_name='Контроль оплаты по контрактам')

    class Meta:
        verbose_name = 'Настройка пользователя'
        verbose_name_plural = 'Настройки пользователей'


class EmployeeProductLink(models.Model):
    """
    Шаблон для прайс-листа сотрудника
    """
    id_employee = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Сотрудник',
                                    related_name='empllink')
    id_product = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Продукция')

    def __str__(self):
        return '{} {}'.format(self.id_employee.fio, self.id_product.name)

    class Meta:
        verbose_name = 'Продукция менеджера'
        verbose_name_plural = 'Продукция менеджеров'
