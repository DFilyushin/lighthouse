from django.db import models
from .org import Employee

MANUFACTURE_STATE = [
    (0, 'черновик'),
    (1, 'в работе'),
    (2, 'завершён')
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
    id_type = models.ForeignKey(RefMaterialType, on_delete=models.CASCADE, verbose_name='Тип материала', default=1)

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
    id_product = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='product_name', verbose_name='Код продукции', default=0)
    calc_amount = models.FloatField(default=0, verbose_name='Расчётное количество')
    calc_losses = models.FloatField(default=0, verbose_name='Плановые потери')
    is_active = models.BooleanField(default=True, verbose_name='Активность рассчёта')
    raws_in_formula = models.ManyToManyField(Material, through='FormulaComp', related_name='raws_in_product', through_fields=('id_formula', 'id_raw'), verbose_name='Состав сырья')

    def __str__(self):
        return self.id_product.name

    def get_raw_in_formula(self):
        return FormulaComp.objects.filter(id_formula=self)

    class Meta:
        verbose_name = 'Рецептура'
        verbose_name_plural = 'Рецептуры'
        ordering = ['created']
        indexes = [
            models.Index(fields=['created'])
        ]


class FormulaComp(models.Model):
    id = models.AutoField(primary_key=True)
    id_formula = models.ForeignKey(Formula, on_delete=models.CASCADE, verbose_name='Код рецептуры')
    id_raw = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Код сырья')
    raw_value = models.FloatField(default=0, verbose_name='Доля')

    def __str__(self):
        return self.id_raw.name

    class Meta:
        verbose_name = 'Состав рецептуры'


class ProductionLine(models.Model):
    name = models.CharField(max_length=100, verbose_name='Наименование линии')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Линия производства'
        verbose_name_plural = 'Линии производства'


class Manufacture(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    id_line = models.ForeignKey(ProductionLine, on_delete=models.CASCADE, verbose_name='Линия производства', default=0)
    id_creator = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Создал', related_name='id_creator_fk')
    id_formula = models.ForeignKey(Formula, on_delete=models.CASCADE, verbose_name='Код формулы', related_name='id_formula_fk')
    id_team_leader = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Руководитель процесса', related_name='id_team_lead_fk')
    prod_start = models.DateTimeField(null=False, blank=False, verbose_name='Начало процесса')
    prod_finish = models.DateTimeField(null=True, blank=True, verbose_name='Завершение процесса')
    calc_value = models.FloatField(default=0, blank=False, null=False, verbose_name='Рассчётное количество')
    cur_state = models.SmallIntegerField(choices=MANUFACTURE_STATE, verbose_name='Состояние процесса')
    out_value = models.FloatField(default=0, verbose_name='Фактический выход продукции')
    loss_value = models.FloatField(default=0, verbose_name='Фактические потери производства')
    comment = models.TextField(blank=True, null=True, verbose_name='Комментарий')
    is_delete = models.BooleanField(default=False, null=False, verbose_name='Удалён?')

    def __str__(self):
        return '{} от {}'.format(self.id_formula.id_product.name, self.prod_start)

    def get_team(self):
        return ProdTeam.objects.filter(id_manufacture=self)

    def get_calculation(self):
        return ProdCalc.objects.filter(id_manufacture=self)

    class Meta:
        verbose_name = 'Производственная карта'
        verbose_name_plural = 'Производственные карты'
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


class ProdCalc(models.Model):
    id_manufacture = models.ForeignKey(Manufacture, on_delete=models.CASCADE, verbose_name='Код производства')
    id_raw = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Код сырья')
    calc_value = models.FloatField(default=0, verbose_name='Значение')

    class Meta:
        verbose_name = 'Калькуляция'
        verbose_name_plural = 'Калькуляции'
