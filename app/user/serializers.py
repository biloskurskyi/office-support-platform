from django.contrib.auth.password_validation import validate_password
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


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value

    def validate(self, data):
        user = self.context['request'].user

        if not user.check_password(data['old_password']):
            raise serializers.ValidationError({"old_password": "Old password is incorrect."})

        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError({"new_password": "New password cannot be the same as the old password."})

        return data


class GetOwnerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['surname', 'name', 'email', 'date_joined', 'user_type', 'info']
        read_only_fields = ['email', 'date_joined', 'user_type']


class GetManagerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['surname', 'name', 'email', 'date_joined', 'user_type', 'info', 'company', 'is_active']
        read_only_fields = ['email', 'date_joined', 'user_type', 'company']
