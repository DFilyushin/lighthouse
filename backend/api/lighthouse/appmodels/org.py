from django.db import models


EMPLOYEE_DOCUMENT_TYPE = [
    (0, 'УДЛ'),
    (1, 'паспорт'),
    (2, 'паспорт иностранного гражданина')
]


class Org(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=False, null=False, verbose_name='Наименование предприятия')
    addr_reg = models.TextField(blank=True, null=True, verbose_name='Регистрационный адрес')
    contact_phone = models.CharField(max_length=100, blank=True, null=True, verbose_name='Контактный телефон')
    contact_email = models.CharField(max_length=100, blank=True, null=True, verbose_name='Email')
    contact_fax = models.CharField(max_length=100, blank=True, null=True, verbose_name='Факс')
    req_bin = models.CharField(max_length=12, blank=True, null=True, verbose_name='БИН')
    req_account = models.CharField(max_length=20, blank=True, null=True, verbose_name='Лицевой счёт')
    req_bank = models.CharField(max_length=255, blank=True, null=True, verbose_name='Банк')
    req_bik = models.CharField(max_length=8, blank=True, null=True, verbose_name='БИК')

    class Meta:
        verbose_name = 'Организация'
        verbose_name_plural = 'Организации'


class Staff(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name = 'Должность'
        verbose_name_plural = 'Должности'
        ordering = ['name']
        indexes = [
            models.Index(fields=['name'])
        ]


class Employee(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    tab_num = models.CharField(max_length=20, null=True, blank=True, verbose_name='Табельный номер')
    fio = models.CharField(max_length=255, null=False, blank=False, verbose_name='Сотрудник')
    dob = models.DateField(null=False, blank=False, verbose_name='Дата рождения')
    doc_type = models.SmallIntegerField(choices=EMPLOYEE_DOCUMENT_TYPE, verbose_name='Тип документа')
    doc_num = models.CharField(max_length=50, blank=True, null=False, verbose_name='Номер документа')
    doc_date = models.DateField(blank=True, null=True, verbose_name='Дата выдачи')
    doc_auth = models.CharField(max_length=255, blank=True, null=False, verbose_name='Орган выдавший документ')
    addr_registration = models.TextField(verbose_name='Адрес регистрации')
    addr_residence = models.TextField(verbose_name='Адрес фактического проживания')
    contact_phone = models.CharField(max_length=255, blank=True, null=True, verbose_name='Контактный телефон')
    contact_email = models.CharField(max_length=255, blank=True, null=True, verbose_name='Email')
    fired = models.DateField(blank=True, null=True, verbose_name='Уволен')

    class Meta:
        verbose_name = 'Сотрудник'
        verbose_name_plural = 'Сотрудники'
        ordering = ['fio']
        indexes = [
            models.Index(fields=['fio']),
            models.Index(fields=['dob']),
            models.Index(fields=['tab_num'])
        ]
