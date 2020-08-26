from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import token_refresh
from rest_framework import routers
import lighthouse.endpoints.api_domain as api_domain_views
import lighthouse.endpoints.api_sales as api_sales_views
import lighthouse.endpoints.api_store as api_store_views
import lighthouse.endpoints.api_prod as api_prod_views
import lighthouse.endpoints.api_user as api_user_views
import lighthouse.endpoints.api_formula as api_formula_views
import lighthouse.endpoints.api_auth as api_token_views
import lighthouse.endpoints.api_setup as api_setup_views

router = routers.DefaultRouter()

# Склад и рецептура
router.register(r'product', api_store_views.ProductViewSet)  # продукция
router.register(r'raw', api_store_views.RawViewSet)  # сырьё
router.register(r'tare', api_store_views.TareViewSet)  # тара
router.register(r'formula', api_formula_views.FormulaViewSet, basename='Formula')  # рецептура
router.register(r'cost', api_store_views.RefCostViewSet, basename='RefCost')
router.register(r'expense', api_store_views.ExpenseViewSet)  # затраты
router.register(r'units', api_store_views.MaterialUnitViewSet)  # единицы измерения
router.register(r'works', api_prod_views.ProductionWorkView)  # работы
router.register(r'reserve', api_store_views.ReservationViewSet)  # резервирование материала
router.register(r'price', api_sales_views.PriceListViewSet, basename='PriceList')
store_urls = [
    path('store', api_store_views.StoreTurnover.as_view()),  # приход продукции
    path('store/raw', api_store_views.RawStoreViewSet.as_view()),  # склад сырья
    path('store/product', api_store_views.ProductStoreViewSet.as_view()),  # склад готовой продукции
    path('store/in/raw', api_store_views.StoreTurnoverRaw.as_view())  # приход сырья на склад

]
router.register(r'store/journal', api_store_views.StoreJournalViewSet, basename='Store')

# Производство
router.register(r'prod', api_prod_views.ProductionView, basename='Manufacture')
router.register(r'prodline', api_prod_views.ProductionLineView)

# Продажи
router.register(r'client', api_sales_views.ClientViewSet)
router.register(r'contract', api_sales_views.ContractViewSet)
router.register(r'paymethod', api_sales_views.PaymentMethodViewSet)
router.register(r'payment', api_sales_views.PaymentViewSet)

# Структура организации
router.register(r'department', api_domain_views.DepartmentViewSet)
router.register(r'staff', api_domain_views.StaffViewSet)
router.register(r'employee', api_domain_views.EmployeeView, basename='Employee')

# Пользователи
router.register(r'user', api_user_views.UserView, basename='User')
router.register(r'group', api_user_views.GroupView)


# Аутентификация
auth_urls = [
    path('api/auth/', api_token_views.ApplicationTokenView.as_view(), name='token_obtain_pair'),
    path('api/refresh_token/', token_refresh, name='refresh'),
]

urlpatterns = [
    path('', include(router.urls)),
    path('api/admin/', admin.site.urls),

    path('org/', api_domain_views.OrgViewSet.as_view()),
    path('setup/<str:code>/', api_setup_views.AppSetupViewSet.as_view()),
    path('setup/', api_setup_views.AppAllSetupViewSet.as_view()),
    path('profile/', api_user_views.ProfileView.as_view()),
    path('change_password/', api_user_views.UserPassView.as_view()),

]
urlpatterns += auth_urls
urlpatterns += store_urls
