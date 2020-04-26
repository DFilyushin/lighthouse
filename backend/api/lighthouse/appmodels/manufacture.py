from django.db import models
from django.db.models import Q
from django.db import DatabaseError, transaction
from .org import Employee
from ..api_errors import *

MATERIAL_RAW_ID = 1
MATERIAL_PRODUCT_ID = 2

CARD_STATE_DRAFT = 0
CARD_STATE_IN_WORK = 1
CARD_STATE_READY = 2
CARD_STATE_ERROR = 3
CARD_STATE_CANCEL = 4

MANUFACTURE_STATE = [
    (CARD_STATE_DRAFT, 'черновик'),
    (CARD_STATE_IN_WORK, 'в работе'),
    (CARD_STATE_READY, 'завершён'),
    (CARD_STATE_ERROR, 'завершено с ошибкой'),
    (CARD_STATE_CANCEL, 'отменено')
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
        """
        Получить список сотрудников в смене
        :return:
        """
        return ProdTeam.objects.filter(id_manufacture=self)

    def get_calculation(self):
        """
        Получить фактические компоненты калькуляции
        :return:
        """
        return ProdCalc.objects.filter(id_manufacture=self)

    def _check_team(self) -> bool:
        """
        Проверка корректности смен (у всех сотрудников должно быть указано начало и окончание смен)
        :return:
        """
        team = ProdTeam.objects.filter(id_manufacture=self).filter(Q(period_start__isnull=True) | Q(period_finish__isnull=True))
        return team.count == 0

    def set_card_status(self, new_status: int):
        expression = 'manufacture.set_card_status'
        if self.cur_state in (0, 2):
            raise AppError(expression, API_ERROR_CARD_INCORRECT_STATUS)
        self.cur_state = new_status
        self.save()

    def execute_card(self):
        """
        Успешное исполнение карты
        Перевод карты в состояние Выполнено
        """
        expression = 'manufacture.execute_card'
        if self.cur_state != CARD_STATE_IN_WORK:
            raise AppError(expression, API_ERROR_CARD_NOT_IN_WORK)
        if self.cur_state == CARD_STATE_READY:
            raise AppError(expression, API_ERROR_CARD_IS_CLOSE)
        if self.prod_finish is None:
            raise AppError(expression, API_ERROR_CARD_NO_SET_FINISH_PROCESS)
        if not self._check_team():
            raise AppError(expression, API_ERROR_CARD_TEAM_ERROR)
        try:
            with transaction.atomic():
                from .store import Store, STORE_OPERATION_IN, STORE_OPERATION_OUT
                self.cur_state = CARD_STATE_READY
                self.save()

                # Добавить на склад готовой продукции
                Store.objects.create(
                    id_material_id=self.id_formula.id_product.id,
                    oper_date=self.prod_finish,
                    oper_value=self.out_value,
                    oper_type=STORE_OPERATION_IN,
                    id_manufacture_id=self.id,
                    id_employee_id=self.id_team_leader_id
                )
                # Списать со склада затраченное сырьё
                for item in self.get_calculation():
                    Store.objects.create(
                        id_material_id=item.id_raw_id,
                        oper_date=self.prod_finish,
                        oper_value=-item.calc_value,
                        oper_type=STORE_OPERATION_OUT,
                        id_manufacture_id=self.id,
                        id_employee_id=self.id_team_leader_id
                    )
        except DatabaseError as e:
            raise AppError('manufacture.execute_card', str(e))

    class Meta:
        verbose_name = 'Производственная карта'
        verbose_name_plural = 'Производственные карты'
        ordering = ['prod_start']
        indexes = [
            models.Index(name='idx_prod_start01', fields=['prod_start'])
        ]


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


