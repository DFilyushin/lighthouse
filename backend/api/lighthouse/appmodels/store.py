from django.db import models
from .sales import Contract
from .manufacture import Material, Manufacture


STORE_OPER_TYPE = [
    (0, 'приход'),
    (1, 'расход')
]


class Store(models.Model):
    id_material = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Сырьё')
    oper_date = models.DateField(null=False, verbose_name='Дата оборота')
    oper_type = models.SmallIntegerField(choices=STORE_OPER_TYPE, default=0, null=False, verbose_name='Тип операции')
    oper_value = models.FloatField(default=0, verbose_name='Количество')
    id_manufacture = models.ForeignKey(Manufacture, on_delete=models.SET_NULL, null=True, verbose_name='Код производства')

    class Meta:
        verbose_name = 'Склад'
        verbose_name_plural = 'Склад'
        indexes = [
            models.Index(name='idx_store_oper_date', fields=['oper_date']),
            models.Index(name='idx_store_id_manuf', fields=['id_manufacture'])
        ]


class Reservation(models.Model):
    id_material = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Материал')
    reserve_start = models.DateField(null=False, blank=False, verbose_name='Дата начала')
    reserve_end = models.DateField(null=False, blank=False, verbose_name='Дата окончания')
    id_employee = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Сотрудник')
    id_contract = models.ForeignKey(Contract, on_delete=models.CASCADE, verbose_name='Контракт')
    reserve_value = models.FloatField(default=0, verbose_name='Количество')

    class Meta:
        verbose_name_plural = 'Резервирование продукции'
        verbose_name = 'Резервирование продукции'
        indexes = [
            models.Index(fields=['id_material', 'reserve_start'])
        ]