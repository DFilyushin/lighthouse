from rest_framework.decorators import api_view, permission_classes, APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, mixins
from .appmodels.manufacture import Material, Tare, Formula, Raw
from .appmodels.org import Employee
from .appmodels.sales import Client
from rest_framework import generics
from rest_framework import filters
from .serializer_domain import *
from .serializer_sales import *
from .serializer_store import *


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hello(request):
    content = {
        'message': 'Hello, World!',
        'user': request.user.username
    }
    return Response(content)



