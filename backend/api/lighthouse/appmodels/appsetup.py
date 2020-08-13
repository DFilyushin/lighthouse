from django.db import models


class AppSetup(models.Model):
    code = models.CharField(max_length=20, null=False, blank=False, unique=True, verbose_name='Код настройки')
    name = models.CharField(max_length=255, default='', null=False, blank=True, verbose_name='Описание')
    kind = models.CharField(max_length=4, null=True, blank=True, verbose_name='Тип настройки')
    int_value = models.IntegerField(default=0, verbose_name='Числовое значение')
    flo_value = models.FloatField(default=0, verbose_name='Точное значение')
    str_value = models.CharField(max_length=255, null=True, blank=True, verbose_name='Строковое значение')
    date_value = models.DateTimeField(null=True, verbose_name='Дата/время')

    class Meta:
        verbose_name = 'Настройка приложения'
        verbose_name_plural = 'Настройки приложения'
        ordering = ['name']