from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .manufacture import Material
from .org import Employee
from .store import RefCost, Cost, Store, REF_COST_PARENT_RAW, REF_COST_PARENT_SALARY
from .sales import Payment, Contract, CONTRACT_STATE_READY, CONTRACT_STATE_DRAFT
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
            id_raw=instance.id,
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