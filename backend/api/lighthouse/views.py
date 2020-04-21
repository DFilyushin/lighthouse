from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hello(request):
    content = {
        'message': 'Hello, World!',
        'user': request.user.username
    }
    return Response(content)



