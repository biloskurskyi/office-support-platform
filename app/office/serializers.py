from rest_framework import serializers

from core.models import Company, Office


class OfficeSerializer(serializers.ModelSerializer):
    company_id = serializers.IntegerField()
    company = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Office
        fields = ['id', 'address', 'city', 'country', 'postal_code', 'phone_number', 'manager', 'company_id', 'company']
        read_only_fields = ['id', 'company']

    def create(self, validated_data):
        company_id = validated_data.pop('company_id', None)
        if company_id is None:
            raise serializers.ValidationError({"company_id": "This field is required."})

            # Переконайтеся, що компанія існує
        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            raise serializers.ValidationError({"company_id": "Company does not exist."})

            # Створіть офіс
        return Office.objects.create(company=company, **validated_data)
