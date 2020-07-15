from rest_framework import serializers


class StatContractSerializer(serializers.ModelSerializer):
    count = serializers.FloatField()
    diff = serializers.IntegerField()

    class Meta:
        model = 'Contract'
        fields = ('count', 'diff')