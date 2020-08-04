from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from lighthouse.appmodels.org import Employee


class ApplicationTokenObtainSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        try:
            employee = Employee.objects.get(userId=self.user.id)
            employee_id = employee.id
        except Employee.DoesNotExist:
            employee_id = 0

        data['username'] = self.user.username
        data['lastName'] = self.user.last_name
        data['firstName'] = self.user.first_name
        data['employee'] = employee_id
        data['groups'] = self.user.groups.values_list('name', flat=True)
        return data


class ApplicationTokenView(TokenObtainPairView):
    serializer_class = ApplicationTokenObtainSerializer
