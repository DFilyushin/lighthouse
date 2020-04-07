from django.db import models
from .org import Employee
from .sales import Contract

MANUFACTURE_STATE = [
    (0, 'черновик'),
    (1, 'в работе'),
    (2, 'завершён')
]

STORE_OPER_TYPE = [
    (0, 'приход'),
    (1, 'расход')
]


class Tare(models.Model):
    id = models.AutoField(primary_key=True, verbose_name='Код')
    name = models.CharField(max_length=255, blank=False, null=False, verbose_name='Наименование')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тара'
        verbose_name_plural = 'Тара'
        ordering = ['name']
        indexes = [
            models.Index(name='idx_tare_name', fields=['name'])
        ]


class RefMaterialType(models.Model):
    id = models.AutoField(primary_key=True, verbose_name='Код')
    name = models.CharField(max_length=50, blank=False, null=False, verbose_name='Наименование')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тип материала'
        verbose_name_plural = 'Типы материалов'
        ordering = ['name']
        indexes = [
            models.Index(fields=['name'])
        ]


class Material(models.Model):
    id = models.AutoField(primary_key=True, verbose_name='Код')
    name = models.CharField(max_length=255, blank=False, null=False, verbose_name='Наименование')
    id_type = models.ForeignKey(RefMaterialType, on_delete=models.CASCADE, verbose_name='Тип материала')

    def __str__(self):
        return '{} {}'.format(self.id_type.name, self.name)

    class Meta:
        verbose_name = 'Материал'
        verbose_name_plural = 'Материалы'
        ordering = ['name']
        indexes = [
            models.Index(fields=['name'])
        ]


class Formula(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    specification = models.TextField(blank=True, null=True, verbose_name='ТУ')
    id_tare = models.ForeignKey(Tare, on_delete=models.CASCADE, verbose_name='Код тары')
    id_product = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Код продукции')
    calc_amount = models.FloatField(default=0, verbose_name='Расчётное количество')
    calc_losses = models.FloatField(default=0, verbose_name='Плановые потери')
    is_active = models.BooleanField(default=True, verbose_name='Активность рассчёта')

    class Meta:
        verbose_name = 'Рецептура'
        verbose_name_plural = 'Рецептуры'
        ordering = ['id_product', 'created']
        indexes = [
            models.Index(fields=['created'])
        ]


class FormulaComp(models.Model):
    id = models.AutoField(primary_key=True)
    id_formula = models.ForeignKey(Formula, on_delete=models.CASCADE, verbose_name='Код рецептуры')
    id_raw = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Код сырья')
    raw_value = models.FloatField(default=0, verbose_name='Доля')

    class Meta:
        verbose_name = 'Состав рецептуры'


class Manufacture(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    id_creator = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Создал')
    id_formula = models.ForeignKey(Formula, on_delete=models.CASCADE, verbose_name='Код формулы')
    id_team_leader = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Руководитель процесса')
    prod_start = models.DateTimeField(null=False, blank=False, verbose_name='Начало процесса')
    prod_finish = models.DateTimeField(null=True, blank=True, verbose_name='Завершение процесса')
    cur_state = models.SmallIntegerField(choices=MANUFACTURE_STATE, verbose_name='Состояние процесса')
    out_value = models.FloatField(default=0, verbose_name='Фактический выход продукции')
    loss_value = models.FloatField(default=0, verbose_name='Фактические потери производства')
    comment = models.TextField(blank=True, null=True, verbose_name='Комментарий')

    class Meta:
        verbose_name = 'Производство'
        verbose_name_plural = 'Производство'
        ordering = ['prod_start']


class ProdTeam(models.Model):
    id = models.AutoField(primary_key=True)
    id_employee = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Сотрудник')
    id_manufacture = models.ForeignKey(Manufacture, on_delete=models.CASCADE, verbose_name='Код производства')
    period_start = models.DateTimeField(blank=False, null=False, verbose_name='Начало работы')
    period_end = models.DateTimeField(blank=True, null=True, verbose_name='Окончание работы')

    class Meta:
        verbose_name = 'Смена'
        verbose_name_plural = 'Смены'
        indexes = [
            models.Index(name='idx_prodteam_period_start', fields=['period_start'])
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