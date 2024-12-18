import mimetypes
import uuid

from django.core.files.storage import default_storage
from rest_framework import serializers

from core.models import Office, Order, Provider


class OrderSerializer(serializers.ModelSerializer):
    provider_id = serializers.IntegerField(source='provider.id')
    provider_name = serializers.CharField(source='provider.name', read_only=True)
    office_id = serializers.IntegerField(source='office.id')
    office_phone_number = serializers.CharField(source='office.phone_number', read_only=True)
    currency = serializers.IntegerField()  # Allows setting currency by ID in POST
    currency_name = serializers.CharField(source='get_currency_display', read_only=True)  # For GET, show the name

    class Meta:
        model = Order
        fields = [
            'id', 'title', 'description', 'deal_value',
            'currency', 'currency_name', 'file',
            'provider_id', 'provider_name',
            'office_id', 'office_phone_number'
        ]
        read_only_fields = ['id', 'currency_name']

    def validate_deal_value(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Deal value cannot be negative.")
        return value

    def validate(self, data):
        provider_id = data.get('provider').get('id') if data.get('provider') else None
        office_id = data.get('office').get('id') if data.get('office') else None

        if provider_id and office_id:
            try:
                provider = Provider.objects.get(id=provider_id)
                office = Office.objects.get(id=office_id)

                if provider.company != office.company:
                    raise serializers.ValidationError("The provider must belong to the same company as the office.")
            except (Provider.DoesNotExist, Office.DoesNotExist):
                raise serializers.ValidationError("Invalid provider or office ID.")

        return data

    def validate_file(self, file):
        if not file.name.endswith('.pdf'):
            raise serializers.ValidationError("Only PDF files are allowed.")

        mimetype, _ = mimetypes.guess_type(file.name)
        if mimetype != 'application/pdf':
            raise serializers.ValidationError("The file must be a PDF document.")

        return file

    def create(self, validated_data):
        office_data = validated_data.pop('office', None)
        office_id = office_data.get('id') if office_data else None

        if not office_id:
            raise serializers.ValidationError("Office ID is required.")

        try:
            office = Office.objects.get(id=office_id)
        except Office.DoesNotExist:
            raise serializers.ValidationError("Invalid Office ID.")

        provider_data = validated_data.pop('provider', None)
        provider_id = provider_data.get('id') if provider_data else None
        if not provider_id:
            raise serializers.ValidationError("Provider ID is required.")

        try:
            provider = Provider.objects.get(id=provider_id)
        except Provider.DoesNotExist:
            raise serializers.ValidationError("Invalid Provider ID.")

        file = validated_data.pop('file', None)
        if file:
            unique_filename = f"{uuid.uuid4()}.pdf"
            file_path = f"records/pdfs/{unique_filename}"
            saved_path = default_storage.save(file_path, file)
            validated_data['file'] = saved_path

        order = Order.objects.create(office=office, provider=provider, **validated_data)
        return order
