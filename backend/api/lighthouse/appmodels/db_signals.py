from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .manufacture import Material
from .store import RefCost, Cost, Store, REF_COST_PARENT_RAW


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
        store = Store.objects.filter(id_cost_id=instance.id).filter(oper_value__gte=0)[0]
        store.oper_value = - store.oper_value
        store.save()

        store.pk = None
        store.oper_value = - store.oper_value
        store.save()
