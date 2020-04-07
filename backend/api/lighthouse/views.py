from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes

import jwt
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from lighthouse.user_serializer import UserLoginSerializer
from rest_framework_jwt.utils import jwt_payload_handler


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hello(request):
    # perssion_classes = (AllowAny)
    content = {
        'message': 'Hello, World!',
        'user': request.user.username
    }
    return Response(content)




