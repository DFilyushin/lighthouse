from django.db.models import Q, F, ExpressionWrapper, Sum, FloatField
from django.db import DatabaseError, transaction, models
from .org import Employee
from lighthouse.endpoints.api_errors import AppError, API_ERROR_CARD_INCORRECT_STATUS, API_ERROR_CARD_NOT_IN_WORK, \
    API_ERROR_CARD_INCORRECT_TARE, API_ERROR_CARD_TEAM_ERROR, API_ERROR_CARD_NO_SET_FINISH_PROCESS, \
    API_ERROR_CARD_IS_CLOSE
from lighthouse.endpoints.api_utils import RoundFunc4

MATERIAL_RAW_ID = 1
MATERIAL_PRODUCT_ID = 2
MATERIAL_STOCK_ID = 3

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


class Plan(models.Model):
    start_date = models.DateField(verbose_name='Начало периода планирования')
    end_date = models.DateField(verbose_name='Окончание периода')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Ответственный')
    sign = models.DateField(null=True, verbose_name='Дата подписания')

    class Meta:
        verbose_name = 'Планирование'
        verbose_name_plural = 'Планирование'


class ProductionWork(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Наименование работы')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Вид работы смены'
        verbose_name_plural = 'Виды работ смены'
        ordering = ('name', )


class Team(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False, unique=True, verbose_name='Наименование')
    id_work = models.ForeignKey(ProductionWork, on_delete=models.CASCADE, default=0, verbose_name='Вид работы')
    members = models.ManyToManyField(Employee, through='TeamMember', through_fields=('id_team', 'id_employee'),
                                     verbose_name='Сотрудник', related_name='members')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Шаблон смены'
        verbose_name_plural = 'Шаблоны смен'
        ordering = ['name']


class TeamMember(models.Model):
    id_team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name='Смена')
    id_employee = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Сотрудник')

    class Meta:
        verbose_name = 'Участник смены'
        verbose_name_plural = 'Участники смены'


class MaterialUnit(models.Model):
    id = models.AutoField(primary_key=True, verbose_name='Код')
    name = models.CharField(max_length=255, blank=False, null=False, unique=True,
                            verbose_name='Наименование ед. измерения')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Единица измерения'
        verbose_name_plural = 'Единицы измерения'
        ordering = ['name']
        indexes = [
            models.Index(name='idx_material_unit_name01', fields=['name'])
        ]


class Tare(models.Model):
    id = models.AutoField(primary_key=True, verbose_name='Код')
    name = models.CharField(max_length=255, blank=False, null=False, verbose_name='Наименование тары')
    id_unit = models.ForeignKey(MaterialUnit, on_delete=models.CASCADE, null=True, blank=True,
                                verbose_name='Единица измерения')
    v = models.FloatField(default=0, null=True, verbose_name='Вместимость')

    def __str__(self):
        return '{} {} {}'.format(self.name, self.v, self.id_unit.name)

    class Meta:
        verbose_name = 'Тара'
        verbose_name_plural = 'Тара'
        ordering = ['name']
        unique_together = ['name', 'id_unit', 'v']
        indexes = [
            models.Index(name='idx_tare_name', fields=['name'])
        ]


class RefMaterialType(models.Model):
    id = models.AutoField(primary_key=True, verbose_name='Код')
    name = models.CharField(max_length=50, blank=False, null=False, unique=True, verbose_name='Наименование')

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
        unique_together = ['name', 'id_type']
        indexes = [
            models.Index(fields=['name'])
        ]


class Formula(models.Model):
    """ Рецептура продукции """
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    specification = models.TextField(blank=True, null=True, verbose_name='ТУ')
    id_tare = models.ForeignKey(Tare, on_delete=models.CASCADE, verbose_name='Код тары')
    id_product = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='product_name',
                                   verbose_name='Код продукции', default=0)
    calc_amount = models.FloatField(default=0, verbose_name='Расчётное количество')
    calc_losses = models.FloatField(default=0, verbose_name='Плановые потери')
    is_active = models.BooleanField(default=True, verbose_name='Активность рассчёта')
    raws_in_formula = models.ManyToManyField(Material, through='FormulaComp', related_name='raws_in_product',
                                             through_fields=('id_formula', 'id_raw'), verbose_name='Состав сырья')
    density = models.FloatField(default=0, null=True, verbose_name='Плотность')

    def __str__(self):
        return self.id_product.name

    def get_raw_in_formula(self):
        return FormulaComp.objects.filter(id_formula=self)

    def get_raws_calculate(self, calc_value: float):
        """
        Калькуляция на основе пользовательского количества
        :param calc_value:
        :return:
        """
        return FormulaComp.objects.filter(id_formula=self)\
            .annotate(calculated=RoundFunc4(F('raw_value') * calc_value / self.calc_amount))

    class Meta:
        verbose_name = 'Рецептура'
        verbose_name_plural = 'Рецептуры'
        ordering = ['created']
        indexes = [
            models.Index(fields=['created'])
        ]


class FormulaComp(models.Model):
    """ Компоненты рецептуры """
    id = models.AutoField(primary_key=True)
    id_formula = models.ForeignKey(Formula, on_delete=models.CASCADE, verbose_name='Код рецептуры')
    id_raw = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Код сырья')
    id_unit = models.ForeignKey(MaterialUnit, default=0, on_delete=models.CASCADE, null=True, verbose_name='Код ед. измерения')
    concentration = models.FloatField(default=0, null=True, verbose_name='Концентрация')
    substance = models.FloatField(default=0, null=True, verbose_name='Содержания')
    raw_value = models.FloatField(default=0, verbose_name='Количество')

    def __str__(self):
        return self.id_raw.name

    class Meta:
        verbose_name = 'Компонент рецептуры'
        verbose_name_plural = 'Компоненты рецептуры'


class ProductionLine(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name='Наименование линии')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Линия производства'
        verbose_name_plural = 'Линии производства'
        ordering = ('name', )


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
    cur_state = models.SmallIntegerField(choices=MANUFACTURE_STATE, default=0, verbose_name='Состояние процесса')
    out_value = models.FloatField(default=0, verbose_name='Фактический выход продукции')
    loss_value = models.FloatField(default=0, verbose_name='Фактические потери производства')
    comment = models.TextField(blank=True, null=True, verbose_name='Комментарий')
    is_delete = models.BooleanField(default=False, null=False, verbose_name='Удалён?')

    def __str__(self):
        return '#{}. {} от {}'.format(self.id, self.id_formula.id_product.name, self.prod_start)

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

    def get_ready_product(self):
        """
        Получить фасованный продукт
        """
        return ProdReadyProduct.objects.filter(id_manufacture=self)

    def _check_team(self) -> bool:
        """
        Проверка корректности смен (у всех сотрудников должно быть указано начало и окончание смен)
        :return:
        """
        team = ProdTeam.objects\
            .filter(id_manufacture=self)\
            .filter(Q(period_start__isnull=True) | Q(period_end__isnull=True))
        return team.count() == 0

    def _check_ready_product(self) -> bool:
        """
        Проверка корректности указания списка готовой продукции в таре
        :return: True = объём в таре меньше либо равен выходу продукции, False - указано больше, чем произвели
        """
        result = ProdReadyProduct.objects\
            .filter(id_manufacture=self)\
            .annotate(value=ExpressionWrapper(Sum(F('tare_count')*F('id_tare__v')), output_field=FloatField()))\
            .aggregate(Sum('value'))
        sum_value = result['value__sum']
        if sum_value is None:
            return False
        else:
            return sum_value == self.out_value

    def set_card_status(self, new_status: int):
        expression = 'manufacture.set_card_status'
        if self.cur_state >= 2:
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
        if not self._check_ready_product():
            raise AppError(expression, API_ERROR_CARD_INCORRECT_TARE)
        try:
            # Выполнить операции со складом в транзакции
            with transaction.atomic():
                from .store import Store, STORE_OPERATION_IN, STORE_OPERATION_OUT
                self.cur_state = CARD_STATE_READY
                self.save()

                # Добавить на склад готовой продукции
                for item in self.get_ready_product():
                    Store.objects.create(
                        id_material=self.id_formula.id_product,
                        oper_date=self.prod_finish,
                        oper_value=item.tare_count,
                        oper_type=STORE_OPERATION_IN,
                        id_tare=item.id_tare,
                        id_employee=self.id_team_leader,
                        id_manufacture=self
                    )

                # Списать со склада затраченное сырьё
                for item in self.get_calculation():
                    Store.objects.create(
                        id_material=item.id_raw,
                        oper_date=self.prod_finish,
                        oper_value=-item.calc_value,
                        oper_type=STORE_OPERATION_OUT,
                        id_manufacture=self,
                        id_employee=self.id_team_leader
                    )
        except DatabaseError as e:
            raise AppError('manufacture.execute_card', str(e))

    class Meta:
        verbose_name = 'Производственная карта'
        verbose_name_plural = 'Производственные карты'
        ordering = ['prod_start']
        indexes = [
            models.Index(name='idx_prod_start01', fields=['prod_start']),
            models.Index(name='idx_prod_created', fields=['created']),
            models.Index(name='idx_prod_state', fields=['cur_state'])
        ]


class ProdTeam(models.Model):
    id = models.AutoField(primary_key=True)
    id_employee = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Сотрудник')
    id_manufacture = models.ForeignKey(Manufacture, on_delete=models.CASCADE, verbose_name='Код производства')
    id_work = models.ForeignKey(ProductionWork, on_delete=models.CASCADE, null=True, default=0, verbose_name='Вид работы')
    period_start = models.DateTimeField(blank=False, null=False, verbose_name='Начало работы')
    period_end = models.DateTimeField(blank=True, null=True, verbose_name='Окончание работы')

    @property
    def get_hours(self):
        """
        Количество часов смены
        :return: Число часов
        """
        diff = self.period_end - self.period_start
        days, seconds = diff.days, diff.seconds
        return days * 24 + seconds // 3600

    def __str__(self):
        return '#{} {} {} - {}'.format(self.id, self.id_employee.fio, self.period_start, self.period_end)

    class Meta:
        verbose_name = 'Смена'
        verbose_name_plural = 'Смены'
        indexes = [
            models.Index(name='idx_prodteam_period_start', fields=['period_start'])
        ]
        ordering = ('period_start', )


class ProdCalc(models.Model):
    id_manufacture = models.ForeignKey(Manufacture, on_delete=models.CASCADE, verbose_name='Код производства')
    id_raw = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Код сырья')
    id_unit = models.ForeignKey(MaterialUnit, on_delete=models.CASCADE, default=0, verbose_name='Код единицы измерения')
    calc_value = models.FloatField(default=0, verbose_name='Количество')

    def __str__(self):
        return '{} {} {}'.format(self.id_raw.name, self.id_unit.name, self.calc_value)

    class Meta:
        verbose_name = 'Действительная калькуляция'
        verbose_name_plural = 'Действительные калькуляции'


class ProdReadyProduct(models.Model):
    id_manufacture = models.ForeignKey(Manufacture, on_delete=models.CASCADE, verbose_name='Код производства')
    id_tare = models.ForeignKey(Tare, on_delete=models.CASCADE, verbose_name='Код тары')
    tare_count = models.IntegerField(default=0, null=False, blank=True, verbose_name='Количество')

    def __str__(self):
        return '{} {} {} x {}'.format(self.id_tare.name, self.id_tare.v, self.id_tare.id_unit.name, self.tare_count)

    class Meta:
        verbose_name = 'Готовая продукция в таре'
        verbose_name_plural = 'Готовая продукция в таре'


class ProdMaterial(models.Model):
    id_manufacture = models.ForeignKey(Manufacture, on_delete=models.CASCADE, verbose_name='Код производства')
    id_material = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Код материала')
    total = models.FloatField(default=0, verbose_name='Количество')

    def __str__(self):
        return '{} {}'.format(self.id_material.name, self.total)

    class Meta:
        verbose_name = 'Материал в карте'
        verbose_name_plural = 'Материалы в карте'
