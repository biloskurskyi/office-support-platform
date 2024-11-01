import uuid
import mimetypes

from django.core.files.storage import default_storage
from rest_framework import serializers

from core.models import Order


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['id']

    def validate_deal_value(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Deal value cannot be negative.")
        return value

    def validate(self, data):
        provider = data.get('provider')
        office = data.get('office')
        if provider and office and provider.company != office.company:
            raise serializers.ValidationError("The provider must belong to the same company as the office.")
        return data

    def validate_file(self, file):
        # Check the file extension
        if not file.name.endswith('.pdf'):
            raise serializers.ValidationError("Only PDF files are allowed.")

        # Check MIME type
        mimetype, _ = mimetypes.guess_type(file.name)
        if mimetype != 'application/pdf':
            raise serializers.ValidationError("The file must be a PDF document.")

        return file

    def create(self, validated_data):
        # Handle the file upload
        file = validated_data.pop('file', None)  # Remove file from validated_data
        if file:
            # Generate a unique filename
            unique_filename = f"{uuid.uuid4()}.pdf"
            # Define the path where the file will be saved
            file_path = f"records/pdfs/{unique_filename}"

            # Save the file to the designated path
            saved_path = default_storage.save(file_path, file)

            # Update validated_data with the saved file path
            validated_data['file'] = saved_path

        # Create the order with the new validated_data that includes the file path
        return super().create(validated_data)
