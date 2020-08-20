from django.db import models
from django.db.models import Sum, F
from django.db.models.functions import Coalesce
from .org import Employee
from .manufacture import Material, Tare
from lighthouse.endpoints.api_errors import AppError, \
    API_ERROR_CONTRACT_INCORRECT_STATUS, API_ERROR_CONTRACT_NO_PAYMENT

CONTRACT_STATE_UNDEFINED = -1
CONTRACT_STATE_DRAFT = 1
CONTRACT_STATE_ACTIVE = 2
CONTRACT_STATE_READY = 3

CLAIM_RESULT_OK = 1
CLAIM_RESULT_PHONE_ERROR = 2


CONTRACT_STATE = [
    (CONTRACT_STATE_DRAFT, 'Черновик'),
    (CONTRACT_STATE_ACTIVE, 'Действующий'),
    (CONTRACT_STATE_READY, 'Исполненный')
]

CLAIM_RESULT = [
    (CLAIM_RESULT_PHONE_ERROR, 'не удалось дозвониться'),
    (CLAIM_RESULT_OK, 'успешно, получен положительный ответ'),
]


class PriceList(models.Model):
    created = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    id_product = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Продукт')
    id_tare = models.ForeignKey(Tare, on_delete=models.CASCADE, verbose_name='Тара')
    on_date = models.DateField(null=False, verbose_name='Начало действия')
    price = models.FloatField(default=0, verbose_name='Цена')

    def __str__(self):
        return '{} {} на {} {}'.format(self.id_product.name, self.id_tare.name, self.on_date, self.price)

    class Meta:
        verbose_name = 'Прайс-лист'
        verbose_name_plural = 'Прайс-листы'


class Client(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    clientname = models.CharField(max_length=255, blank=False, null=False, verbose_name='Наименование')
    contact_employee = models.CharField(max_length=255, blank=True, null=False, verbose_name='Контактный сотрудник')
    id_agent = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Агент')
    addr_reg = models.TextField(blank=True, null=True, verbose_name='Регистрационный адрес')
    contact_phone = models.CharField(max_length=100, blank=True, null=True, verbose_name='Контактный телефон')
    contact_email = models.CharField(max_length=100, blank=True, null=True, verbose_name='Email')
    contact_fax = models.CharField(max_length=100, blank=True, null=True, verbose_name='Факс')
    req_bin = models.CharField(max_length=12, blank=True, null=True, verbose_name='БИН')
    req_account = models.CharField(max_length=20, blank=True, null=True, verbose_name='Лицевой счёт')
    req_bank = models.CharField(max_length=255, blank=True, null=True, verbose_name='Банк')
    req_bik = models.CharField(max_length=8, blank=True, null=True, verbose_name='БИК')
    req_boss = models.CharField(max_length=255, blank=True, null=True, verbose_name='Руководитель')
    comment = models.TextField(blank=True, null=True, verbose_name='Комментарий')
    clientid  = models.CharField(max_length=10, blank=True, null=True, verbose_name='Код клиента из сторонних систем')
    deleted = models.BooleanField(default=False, null=False, verbose_name='Удалён')

    def __str__(self):
        return self.clientname

    class Meta:
        verbose_name = 'Клиент'
        verbose_name_plural = 'Клиенты'
        ordering = ['clientname']
        indexes = [
            models.Index(fields=['clientname'], name='idx_client_name_01'),
            models.Index(fields=['req_bin'], name='idx_client_bin_01'),
        ]


class Contract(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    id_client = models.ForeignKey(Client, on_delete=models.CASCADE, verbose_name='Клиент')
    num = models.CharField(max_length=50, blank=True, null=False, verbose_name='Номер контракта')
    contract_date = models.DateField(null=False, verbose_name='Дата контракта')
    contract_state = models.SmallIntegerField(choices=CONTRACT_STATE, verbose_name='Состояние контракта')
    comment = models.TextField(blank=True, null=True, verbose_name='Комментарий')
    est_delivery = models.DateField(blank=False, null=False, verbose_name='Дата поставки')
    delivered = models.DateField(null=True, verbose_name='Фактическая доставка')
    discount = models.FloatField(default=0, verbose_name='Скидка')
    contractid = models.CharField(max_length=10, null=True, verbose_name='Код контракта из сторонней системы')
    id_agent = models.ForeignKey(Employee, on_delete=models.CASCADE, default=0, verbose_name='Агент')
    deleted = models.BooleanField(default=False, null=False, verbose_name='Удалён')
    delivery_terms = models.CharField(max_length=512, null=True, blank=True, verbose_name='Условия доставки')

    def __str__(self):
        return '{} {} {}'.format(self.num, self.id_client.clientname, self.contract_date)

    def get_all_payments(self):
        """
        Общая сумма оплат по контракту
        :return: Сумма контракта
        """
        p = Payment.objects.filter(id_contract=self).aggregate(value=Coalesce(Sum('pay_value'), 0))
        return p['value']

    def get_total_sum(self):
        """
        Сумма контракта
        :return: Сумма контракта
        """
        p = ContractSpec.objects.filter(id_contract=self)\
            .aggregate(value=Coalesce(Sum((F('item_price') * F('item_count') * (F('item_nds')/100 + 1)) - F('item_discount')), 0))
        return p['value']

    def set_contract_status(self, new_status: int):
        """
        Установить статус контракта
        :param new_status: Новый статус
        :return:
        """
        if (new_status < CONTRACT_STATE_DRAFT) & (new_status > CONTRACT_STATE_READY):
            raise AppError('sales.set_contract_status', API_ERROR_CONTRACT_INCORRECT_STATUS)
        if new_status == CONTRACT_STATE_READY:
            # проверка суммы платежей и общей стоимости контракта
            if self.get_all_payments() != self.get_total_sum():
                raise AppError('sales.set_contract_status', API_ERROR_CONTRACT_NO_PAYMENT)
        self.contract_state = new_status
        self.save()

    class Meta:
        verbose_name = 'Контракт'
        verbose_name_plural = 'Контракты'
        ordering = ['created']
        indexes = [
            models.Index(fields=['contract_date'], name='idx_contract_01'),
            models.Index(fields=['delivered'], name='idx_contract_02'),
            models.Index(fields=['num'], name='idx_contract_03'),
            models.Index(fields=['contractid'], name='idx_contract_04')
        ]


class ContractSpec(models.Model):
    id = models.AutoField(primary_key=True)
    id_contract = models.ForeignKey(Contract, related_name='specs', on_delete=models.CASCADE, verbose_name='Контракт')
    id_product = models.ForeignKey(Material, on_delete=models.CASCADE, verbose_name='Продукт')
    id_tare = models.ForeignKey(Tare, null=True, on_delete=models.SET_NULL, verbose_name='Код тары')
    item_nds = models.FloatField(default=0, verbose_name='Ставка НДС')
    item_count = models.FloatField(default=0, verbose_name='Количество')
    item_price = models.FloatField(default=0, verbose_name='Цена')
    item_discount = models.FloatField(default=0, verbose_name='Скидка')
    delivery_date = models.DateField(blank=True, null=True, verbose_name='Дата доставки')
    delivered = models.DateField(blank=True, null=True, verbose_name='Доставлен')

    @property
    def total(self):
        nds_value = (self.item_nds/100+1)
        full_price = (self.item_count * self.item_price) * nds_value
        return round(full_price - self.item_discount, 2)

    def __str__(self):
        return '{} {} {}'.format(self.id_contract.id_client.clientname, self.id_product.name, self.item_count)

    class Meta:
        verbose_name = 'Спецификация контракта'
        verbose_name_plural = 'Спецификации контракта'
        indexes = [
            models.Index(fields=['delivery_date'], name='idx_contract_spec_01')
        ]


class ContractExpectedPayment(models.Model):
    created = models.DateTimeField(auto_now_add=True, verbose_name='Создана')
    id_contract = models.ForeignKey(Contract, related_name='expected_payment', on_delete=models.CASCADE,
                                    verbose_name='Контракт')
    wait_date = models.DateField(null=False, verbose_name='Ожидаемая дата оплаты')
    wait_value = models.FloatField(default=0, verbose_name='Сумма оплаты')

    class Meta:
        verbose_name = 'График оплата'
        verbose_name_plural = 'График оплат'
        indexes = [
            models.Index(fields=['id_contract', 'wait_date'], name='idx_wait_01')
        ]


class Claim(models.Model):
    created = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    id_contract = models.ForeignKey(Contract, on_delete=models.CASCADE, verbose_name='Контракт')
    claim_date = models.DateField(null=True, verbose_name='Дата претензии')
    claim_type = models.IntegerField(verbose_name='Тип претензии')
    num = models.CharField(max_length=50, verbose_name='Номер')
    cur_state = models.SmallIntegerField(verbose_name='Состояние')
    content = models.TextField(blank=True, null=False, verbose_name='Текст')
    id_creator = models.ForeignKey(Employee, on_delete=models.CASCADE, verbose_name='Создатель')

    class Meta:
        verbose_name = 'Претензия'
        verbose_name_plural = 'Претензии'
        indexes = [
            models.Index(fields=['claim_date'], name='idx_claim_01')
        ]


class ClaimHistory(models.Model):
    id_claim = models.ForeignKey(Claim, on_delete=models.CASCADE, verbose_name='Претензия')
    cont_date = models.DateTimeField()
    cont_employee = models.CharField(max_length=255, verbose_name='С кем контактировали')
    cont_staff = models.CharField(max_length=255, verbose_name='Должность')
    cont_result = models.SmallIntegerField(choices=CLAIM_RESULT, verbose_name='Результат')
    next_alarm = models.DateTimeField(null=True, verbose_name='Следующее оповщение')
    next_alarm_stop = models.BooleanField(default=False, verbose_name='Остановить оповещение')
    content = models.TextField(null=True, blank=True, verbose_name='Суть обращения')

    class Meta:
        verbose_name = 'История обращения'
        verbose_name_plural = 'Истории обращений'
        indexes = [
            models.Index(fields=['cont_date'], name='idx_claim_history_01')
        ]


class PaymentMethod(models.Model):
    name = models.CharField(max_length=255, verbose_name='Тип оплаты')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Метод оплаты'
        verbose_name_plural = 'Методы оплаты'
        ordering = ['name']
        indexes = [
            models.Index(fields=['name'], name='idx_payment_method_name')
        ]


class Payment(models.Model):
    created = models.DateTimeField(auto_now_add=True, verbose_name='Создана')
    id_contract = models.ForeignKey(Contract, related_name='payments', on_delete=models.CASCADE, verbose_name='Контракт')
    pay_date = models.DateField(null=False, verbose_name='Дата оплаты')
    pay_num = models.CharField(max_length=20, verbose_name='Номер документа')
    pay_type = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE, verbose_name='Тип оплаты')
    pay_value = models.FloatField(default=0, verbose_name='Сумма оплаты')

    def __str__(self):
        return '{} {} {}'.format(self.pay_date, self.pay_num, self.pay_value)

    class Meta:
        verbose_name = 'Оплата'
        verbose_name_plural = 'Оплаты'
        ordering = ['pay_date']
        indexes = [
            models.Index(fields=['pay_date'], name='idx_payment_01'),

        ]

