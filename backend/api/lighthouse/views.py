from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hello(request):
    content = {
        'message': 'Hello, World!',
        'user': request.user.username
    }
    return Response(content)


@api_view(['GET'])
def index(request):
    return Response(status=status.HTTP_403_FORBIDDEN)