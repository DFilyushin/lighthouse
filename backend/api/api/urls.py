from django.contrib import admin
from django.urls import path, include
from lighthouse.user_auth import UserLoginView
from lighthouse.views import hello
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, ObtainJSONWebToken, RefreshJSONWebToken
from rest_framework import routers
import lighthouse.views as views


router = routers.DefaultRouter()
router.register(r'product', views.ProductViewSet)
router.register(r'raw', views.RawViewSet)
router.register(r'tare', views.TareViewSet)
router.register(r'formula', views.FormulaViewSet, basename='Formula')
router.register(r'material', views.MaterialViewSet)
router.register(r'employee', views.EmployeeActiveViewSet)
router.register(r'client', views.ClientViewSet)
# router.register(r'org', views.OrgViewSet, basename='Org')


urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('hello/', hello, name='hello'),
    path('clients/', views.ClientList.as_view()),
    path('org/', views.OrgViewSet.as_view()),
    path('api/refresh_token/', refresh_jwt_token, name='refresh'),
    path('api/auth/', UserLoginView.as_view(), name='login'),
    path('api/get_token/', ObtainJSONWebToken.as_view(), name='token_obtain_pair'),
    path('api/get_refresh_token/', RefreshJSONWebToken.as_view()),
]
