import re
from datetime import timedelta

from decouple import config
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from app import settings


class UserManager(BaseUserManager):
    """
    Custom manager for the User model.
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a regular user with an email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', False)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with an email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields['user_type'] = 0

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        extra_fields.pop('username', None)

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model for the application.
    """
    ADMIN_USER = 0
    OWNER_USER = 1
    MANAGER_USER = 2
    USER_TYPE_CHOICES = ((ADMIN_USER, 'admin user'), (OWNER_USER, 'owner user'), (MANAGER_USER, 'manager user'),)
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    user_type = models.SmallIntegerField(choices=USER_TYPE_CHOICES)
    info = models.CharField(max_length=255, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def is_owner(self):
        return self.user_type == self.OWNER_USER

    def is_manager(self):
        return self.user_type == self.MANAGER_USER

    def save(self, *args, **kwargs):
        if self.user_type == self.ADMIN_USER:
            if User.objects.filter(user_type=self.ADMIN_USER).exclude(id=self.id).exists():
                raise ValidationError("Only one admin user is allowed in the system.")
        super().save(*args, **kwargs)

    def __str__(self):
        if self.user_type == self.OWNER_USER:
            return f"{self.name} with email {self.email} (Owner User)"
        elif self.user_type == self.MANAGER_USER:
            return f"{self.name} with email {self.email} (Manager User)"
        elif self.user_type == self.ADMIN_USER:
            return f"{self.name} with email {self.email} (Admin User)"

    # def set_password(self, raw_password):
    #     """
    #     Set the password for the user after validating its strength.
    #     """
    #     if len(raw_password) < int(config('PASSWORD_LENGTH')):
    #         raise ValidationError("Password must be at least 8 characters long.")
    #     if not re.search(r'[A-Z]', raw_password):
    #         raise ValidationError("Password must contain at least one uppercase letter.")
    #
    #     super().set_password(raw_password)


class Company(models.Model):
    name = models.CharField(max_length=255)
    legal_name = models.CharField(max_length=255, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_companies')
    description = models.TextField(blank=True, null=True)
    website = models.URLField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Company"
        verbose_name_plural = "Companies"

    def __str__(self):
        return f"Company {self.name} with owner {self.owner}. {self.description}. Website: {self.website}"


class Office(models.Model):
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    phone_number = models.CharField(max_length=20, unique=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = "Office"
        verbose_name_plural = "Offices"

    def __str__(self):
        return f"Office for {self.company.name} on {self.address}, city: {self.city}, country: {self.country}"


class Utilities(models.Model):
    HEATING = 0
    WATER_SUPPLY = 1
    GAS_SUPPLY = 2
    ELECTRICITY_SUPPLY = 3
    WASTE_COLLECTION = 4
    UTILITIES_TYPE_CHOICES = ((HEATING, 'Heating'),
                              (WATER_SUPPLY, 'Water Supply'),
                              (GAS_SUPPLY, 'Gas Supply'),
                              (ELECTRICITY_SUPPLY, 'Electricity Supply'),
                              (WASTE_COLLECTION, 'Waste Collection'),)
    utilities_type = models.SmallIntegerField(choices=UTILITIES_TYPE_CHOICES)
    date = models.DateField()
    counter = models.PositiveIntegerField()
    price = models.FloatField()
    office = models.ForeignKey(Office, on_delete=models.CASCADE)

    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(
    #             fields=['office', 'utilities_type'],
    #             condition=models.Q(date__year=models.F('date__year'), date__month=models.F('date__month')),
    #             name='unique_utility_per_month'
    #         )
    #     ]
