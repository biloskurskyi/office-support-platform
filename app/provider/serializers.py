from rest_framework import serializers

from core.models import Provider


class ProviderSerializer(serializers.ModelSerializer):
    company_id = serializers.IntegerField(source='company.id', read_only=True)
    company = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Provider
        fields = ('id', 'company', 'name', 'address', 'phone_number', 'email', 'bank_details', 'company_id')
        read_only_fields = ('id', 'company_id')
