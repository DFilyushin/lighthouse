from django.contrib import admin
from django.urls import path
from lighthouse.user_auth import UserLoginView
from lighthouse.views import hello
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, ObtainJSONWebToken, RefreshJSONWebToken

urlpatterns = [
    path('admin/', admin.site.urls),
    path('hello/', hello, name='hello'),
    path('api/refresh_token/', refresh_jwt_token, name='refresh'),
    path('api/auth/', UserLoginView.as_view(), name='login'),
    path('api/get_token/', ObtainJSONWebToken.as_view(), name='token_obtain_pair'),
    path('api/get_refresh_token/', RefreshJSONWebToken.as_view()),
]
