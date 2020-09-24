from datetime import date
from django.db.models.signals import post_save, pre_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .manufacture import Material
from .org import Employee
from .store import RefCost, Cost, Store, REF_COST_PARENT_RAW, REF_COST_PARENT_SALARY
from .sales import Payment, Contract, CONTRACT_STATE_READY, CONTRACT_STATE_DRAFT
from .appsetup import UserSettings
from django.db import IntegrityError, ProgrammingError


@receiver(post_save, sender=Material)
def material_post_save_handler(sender, **kwargs):
    """
    Триггер after insert Material
    Добавить запись в справочник статей расходов на закуп вновь добавленного сырья
    :param sender: RefCost - object
    :param kwargs: ...created, instance
    :return:
    """
    if kwargs['raw']:
        return
    if kwargs.get('created', False):
        inst = kwargs['instance']
        RefCost.objects.create(
            name='Закуп сырья {}'.format(inst.name),
            id_raw_id=inst.id,
            id_parent_id=REF_COST_PARENT_RAW,
            is_system=True
        )


@receiver(post_save, sender=Employee)
def employee_post_save_handler(sender, **kwargs):
    """
    Триггер after insert Employee
    :param sender: Employee
    :param kwargs: ...created, instance
    :return:
    """
    if kwargs['raw']:
        return
    if kwargs.get('created', False):
        instance = kwargs['instance']
        RefCost.objects.create(
            name='З/п {}'.format(instance.fio),
            id_employee_id=instance.id,
            id_parent_id=REF_COST_PARENT_SALARY,
            is_system=True
        )


@receiver(pre_save, sender=Cost)
def cost_post_save_handler(sender, **kwargs):
    """
    Корректировка склада
    :param sender:
    :param kwargs: ...created, instance
    :return:
    """
    if kwargs['raw']:
        return
    if not kwargs.get('created', False):
        instance = kwargs['instance']
        if instance.id_cost.id_raw is not None:
            new_value = instance.cost_count
            try:
                store = Store.objects.filter(id_cost_id=instance.id).filter(oper_value__gte=0).filter(is_delete=False)[0]
                if new_value != store.oper_value:
                    store.is_delete = True
                    store.save()

                    store.pk = None
                    store.oper_value = new_value
                    store.is_delete = False
                    store.save()
            except Store.DoesNotExist:
                return
            except IndexError:
                return


@receiver(pre_save, sender=Payment)
def payment_post_before_handler(sender, **kwargs):
    """
    Триггер проверки контракта перед сохранением оплаты
    :param sender:
    :param kwargs:
    :return:
    """
    if kwargs['raw']:
        return
    instance = kwargs['instance']
    contract = Contract.objects.get(pk=instance.id_contract.id)
    print(contract.contract_state)
    if contract.contract_state == CONTRACT_STATE_DRAFT:
        raise ProgrammingError('Контракт в состоянии черновика, оплата невозможна!')
    if contract.contract_state == CONTRACT_STATE_READY:
        raise ProgrammingError('Контракт исполнен!')


@receiver(post_save, sender=User)
def user_after_save(sender, **kwargs):
    """
    Триггер после сохранения пользователя
    :param sender:
    :param kwargs:
    :return:
    """
    if kwargs['raw']:
        return
    user = kwargs.get('instance', None)
    created = kwargs.get('created', None)
    if user:
        # Создание настроек для пользователя
        if created:
            UserSettings.objects.create(
                user=user,
                last_password=date.today()
            )


@receiver(pre_save, sender=User)
def user_pre_save(sender, **kwargs):
    """
    Триггер перед сохранением пользователя
    :param sender:
    :param kwargs:
    :return:
    """
    if kwargs['raw']:
        return
    user = kwargs.get('instance', None)
    created = kwargs.get('created', None)
    if not created:
        # Установка даты смены пароля
        new_password = user.password
        try:
            old_password = User.objects.get(pk=user.pk).password
        except User.DoesNotExist:
            old_password = None
        if old_password != new_password:
            try:
                settings = UserSettings.objects.get(user=user)
                settings.last_password = date.today()
                settings.save()
            except UserSettings.DoesNotExist:
                pass
