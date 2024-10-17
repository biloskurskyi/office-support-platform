from rest_framework import serializers

from core.models import Utilities


class UtilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilities
        fields = ['id', 'utilities_type', 'date', 'counter', 'price', 'office']
        read_only_fields = ['id']
