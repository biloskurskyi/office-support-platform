from rest_framework import serializers

from core.models import Provider


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ('company', 'name', 'address', 'phone_number', 'email', 'bank_account_number_IBAN')
        read_only_fields = ('id', 'company')
