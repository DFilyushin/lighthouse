from django.contrib import admin
from django.urls import path, include
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, ObtainJSONWebToken, RefreshJSONWebToken
from rest_framework import routers
import lighthouse.api_auth as api_auth_views
import lighthouse.api_domain as api_domain_views
import lighthouse.api_sales as api_sales_views
import lighthouse.api_store as api_store_views
import lighthouse.api_prod as api_prod_views

router = routers.DefaultRouter()

# Склад и рецептура
router.register(r'product', api_store_views.ProductViewSet)  # продукция
router.register(r'raw', api_store_views.RawViewSet)  # сырьё
router.register(r'tare', api_store_views.TareViewSet)  # тара
router.register(r'formula', api_store_views.FormulaViewSet, basename='Formula')  # рецептура


# Производство
router.register(r'prod', api_prod_views.ProductionView, basename='Manufacture')
router.register(r'prodline', api_prod_views.ProductionLineView)

# Продажи
router.register(r'client', api_sales_views.ClientViewSet)

# Структура организации
router.register(r'staff', api_domain_views.StaffViewSet)
router.register(r'employee', api_domain_views.EmployeeView, basename='Employee')

# Аутентификация
auth_urls = [
    path('api/refresh_token/', refresh_jwt_token, name='refresh'),
    path('api/auth/', api_auth_views.UserLoginView.as_view(), name='login'),
    path('api/get_token/', ObtainJSONWebToken.as_view(), name='token_obtain_pair'),
    path('api/get_refresh_token/', RefreshJSONWebToken.as_view()),
]

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),

    path('org/', api_domain_views.OrgViewSet.as_view()),
]
urlpatterns += auth_urls
