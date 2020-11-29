from django.db import models
from django.db import transaction
from .sales import Contract
from .manufacture import Material, Manufacture, MaterialUnit, Tare
from .org import Employee

REF_COST_PARENT_RAW = 0
REF_COST_PARENT_SALARY = 1

STORE_OPERATION_IN = 0
STORE_OPERATION_OUT = 1

STORE_OPERATION_TYPE = [
    (STORE_OPERATION_IN, 'приход'),
    (STORE_OPERATION_OUT, 'расход')
]


class RefCost(models.Model):
    id_parent = models.ForeignKey('RefCost', blank=True, null=True, on_delete=models.SET_NULL,
                                  verbose_name='Родительская затрата', related_name='parentcost')
    name = models.CharField(max_length=255, blank=False, null=False, verbose_name='Наименование')
    id_raw = models.ForeignKey(Material, on_delete=models.SET_NULL, null=True, verbose_name='Ссылка на сырьё')
    id_employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, verbose_name='Ссылка на сотрудника')
    is_system = models.BooleanField(default=False, null=False, verbose_name='Системная')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тип затраты'
        verbose_name_plural = 'Типы затрат'
        ordering = ['name']
        indexes = [
            models.Index(name='idx_cost_name01', fields=['name'])
        ]


class Cost(models.Model):
    created = models.DateTimeField(auto_now_add=True, verbose_name='Создана')
    id_cost = models.ForeignKey(RefCost, on_delete=models.CASCADE, verbose_name='Тип затраты')
    cost_date = models.DateField(blank=False, null=False, verbose_name='Дата затраты')
    cost_count = models.FloatField(default=0, null=False, verbose_name='Количество закупленного сырья')
    id_unit = models.ForeignKey(MaterialUnit, on_delete=models.SET_DEFAULT, default=0, null=True,
                                verbose_name='Единица измерения')
    total = models.FloatField(default=0, verbose_name='Сумма')
    comment = models.TextField(blank=True, null=True, verbose_name='Комментарий')
    id_employee = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Сотрудник')
    is_delete = models.BooleanField(default=False, null=True, verbose_name='Признак удаления')

    def delete_cost(self):
        with transaction.atomic():
            if self.id_cost.id_raw:
                Store.objects.filter(id_cost_id=self.id).delete()
            self.is_delete = True
            self.save()

    class Meta:
        verbose_name = 'Затрата'
        verbose_name_plural = 'Затраты'
        ordering = ['cost_date']
        indexes = [
            models.Index(name='idx_cost_costdate_01', fields=['cost_date']),
        ]


class Store(models.Model):
    created = models.DateTimeField(auto_now_add=True, null=True, verbose_name='Дата создания записи')
    id_material = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Материал')
    id_tare = models.ForeignKey(Tare, on_delete=models.SET_DEFAULT, default=0, null=True, verbose_name='Тара')
    oper_date = models.DateField(null=False, verbose_name='Дата оборота')
    oper_type = models.SmallIntegerField(choices=STORE_OPERATION_TYPE, default=0, null=False,
                                         verbose_name='Тип операции')
    oper_value = models.FloatField(default=0, verbose_name='Количество')
    oper_price = models.FloatField(default=0, verbose_name='Цена за единицу')
    id_manufacture = models.ForeignKey(Manufacture, on_delete=models.SET_NULL, null=True,
                                       verbose_name='Код производства')
    id_employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, verbose_name='Код сотрудника')
    id_cost = models.ForeignKey(Cost, on_delete=models.SET_NULL, null=True, verbose_name='Код затраты')
    is_delete = models.BooleanField(default=False, null=True, verbose_name='Признак удаления')

    def __str__(self):
        return '{} {} {}'.format(self.id_material.name, self.id_tare, self.oper_value)

    class Meta:
        verbose_name = 'Склад'
        verbose_name_plural = 'Склад'
        indexes = [
            models.Index(name='idx_store_oper_date', fields=['oper_date']),
            models.Index(name='idx_store_id_manuf', fields=['id_manufacture'])
        ]


class Reservation(models.Model):
    created = models.DateTimeField(auto_now_add=True, null=True, verbose_name='Дата создания записи')
    id_material = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Материал')
    reserve_start = models.DateField(null=False, blank=False, verbose_name='Дата начала')
    reserve_end = models.DateField(null=False, blank=False, verbose_name='Дата окончания')
    id_employee = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Сотрудник')
    id_contract = models.ForeignKey(Contract, on_delete=models.CASCADE, verbose_name='Контракт',
                                    related_name='contract_reserve_link')
    id_tare = models.ForeignKey(Tare, null=True, on_delete=models.CASCADE, verbose_name='Тара')
    reserve_value = models.FloatField(default=0, verbose_name='Количество')

    def __str__(self):
        return '{} {}'.format(self.id_material.name, self.reserve_value)

    class Meta:
        verbose_name_plural = 'Резервирование продукции'
        verbose_name = 'Резервирование продукции'
        indexes = [
            models.Index(fields=['id_material', 'reserve_start']),
            models.Index(fields=['reserve_start']),
            models.Index(fields=['reserve_end'])
        ]
        ordering = ('reserve_start',)
