from django.contrib import admin
from .appmodels.org import Org, Staff
from .appmodels.manufacture import *
from .appmodels.store import *


@admin.register(Org)
class OrgAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name', )


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('fio', )
    search_fields = ('fio', )


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('name', )
    search_fields = ('name', )


@admin.register(RefMaterialType)
class RefMaterialTypeAdmin(admin.ModelAdmin):
    list_display = ('name', )
    search_fields = ('name', )


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('name', 'id_type')
    search_fields = ('name', )


@admin.register(Formula)
class FormulaAdmin(admin.ModelAdmin):
    pass


@admin.register(ProductionLine)
class ProductionLineAdmin(admin.ModelAdmin):
    list_display = ('name', )
    search_fields = ('name', )


@admin.register(Tare)
class TareAdmin(admin.ModelAdmin):
    pass


@admin.register(MaterialUnit)
class MaterialUnitAdmin(admin.ModelAdmin):
    pass


@admin.register(Manufacture)
class ManufactureAdmin(admin.ModelAdmin):
    pass


@admin.register(ProdTeam)
class ProdTeamAdmin(admin.ModelAdmin):
    pass


@admin.register(ProdCalc)
class ProdCalcAdmin(admin.ModelAdmin):
    pass


@admin.register(ProdReadyProduct)
class ProdReadyProductAdmin(admin.ModelAdmin):
    pass


@admin.register(RefCost)
class RefCostAdmin(admin.ModelAdmin):
    pass


@admin.register(Cost)
class CostAdmin(admin.ModelAdmin):
    pass


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    pass
