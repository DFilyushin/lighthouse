from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .manufacture import Material
from .store import RefCost, Cost, Store, REF_COST_PARENT_RAW
from .support import *


@receiver(post_save, sender=Material)
def material_post_save_handler(sender, **kwargs):
    """
    Триггер after insert Material
    Добавить запись в справочник статей расходов на закуп вновь добавленного сырья
    :param sender: RefCost - object
    :param kwargs: ...created, instance
    :return:
    """
    if kwargs.get('created', False):
        inst = kwargs['instance']
        RefCost.objects.create(
            name='Закуп сырья {}'.format(inst.name),
            id_raw_id=inst.id,
            id_parent_id=REF_COST_PARENT_RAW,
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
    if not kwargs.get('created', False):
        instance = kwargs['instance']
        if instance.id_cost.id_raw is not None:
            new_value = instance.cost_count
            store = Store.objects.filter(id_cost_id=instance.id).filter(oper_value__gte=0).filter(is_delete=False)[0]
            if new_value != store.oper_value:
                store.is_delete = True
                store.save()

                store.pk = None
                store.oper_value = new_value
                store.is_delete = False
                store.save()
