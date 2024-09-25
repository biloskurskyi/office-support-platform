from rest_framework import serializers

from core.models import Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'legal_name', 'owner', 'description', 'website', 'created_at']
        read_only_fields = ['id', 'owner', 'created_at']
