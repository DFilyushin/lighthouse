from django.contrib import admin
from .appmodels.org import *
from .appmodels.manufacture import *
from .appmodels.store import *
from .appmodels.sales import *
from .appmodels.appsetup import *


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    pass


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    pass


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    pass


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id_material', 'reserve_start', 'reserve_end', 'reserve_value')


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    pass


@admin.register(ProductionWork)
class ProductionWorkAdmin(admin.ModelAdmin):
    pass


@admin.register(AppSetup)
class AppSetupAdmin(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ('code', 'name')


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('clientname', 'deleted')
    search_fields = ('clientname', )


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('id_client', 'num', 'contract_date')
    search_fields = ('id_client', 'num')


@admin.register(ContractSpec)
class ContractSpecAdmin(admin.ModelAdmin):
    list_display = ('id_contract', 'id_product', 'item_count')
    search_fields = ('id_contract',)


@admin.register(ContractExpectedPayment)
class ContractExpectedPaymentAdmin(admin.ModelAdmin):
    list_display = ('id_contract', 'wait_date', 'wait_value')


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id_contract', 'pay_date', 'pay_num', 'pay_value')


@admin.register(PriceList)
class PriceListAdmin(admin.ModelAdmin):
    list_display = ('id_product', 'id_tare', 'on_date', 'price')


@admin.register(Org)
class OrgAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name', )


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('fio', 'id_staff')
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
    list_display = ('id', 'id_product', 'calc_amount', 'calc_losses')


@admin.register(FormulaComp)
class FormulaCompAdmin(admin.ModelAdmin):
    list_display = ('id', 'id_formula', 'id_raw', 'concentration', 'raw_value')


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
    list_display = ('id', 'prod_start', 'id_line', 'id_formula')


@admin.register(ProdTeam)
class ProdTeamAdmin(admin.ModelAdmin):
    list_display = ('id_manufacture', 'id_employee', 'id_work')


@admin.register(ProdCalc)
class ProdCalcAdmin(admin.ModelAdmin):
    pass


@admin.register(ProdMaterial)
class ProdMaterialAdmin(admin.ModelAdmin):
    list_display = ('id_manufacture', 'id_material', 'total')


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
