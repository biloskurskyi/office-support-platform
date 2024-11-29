from rest_framework import serializers

from core.models import Office


class OfficeSerializer(serializers.ModelSerializer):
    company_id = serializers.IntegerField(source='company.id', read_only=True)
    company = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Office
        fields = ['id', 'address', 'city', 'country', 'postal_code', 'phone_number', 'manager', 'company_id', 'company']
        read_only_fields = ['id']
