from rest_framework import serializers

from core.models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializes User data including password handling.
    """
    class Meta:
        model = User
        fields = ['id', 'surname', 'name', 'email', 'password', 'user_type', 'info', 'company']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """
        Creates a User instance with hashed password.
        """
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data, is_active=False)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
