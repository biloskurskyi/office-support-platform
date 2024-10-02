from rest_framework import serializers

from core.models import Office


class OfficeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Office
        fields = ['id', 'address', 'city', 'country', 'postal_code', 'phone_number', 'manager', 'company']
        read_only_fields = ['id',]
