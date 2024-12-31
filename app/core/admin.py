from django.contrib import admin
from .models import User, Company, Office, Utilities, Provider, Order


class UserAdmin(admin.ModelAdmin):
    """
    Admin interface for managing User model.
    """
    list_display = ('name', 'surname', 'email', 'user_type', 'is_active', 'is_confirmed')
    search_fields = ('name', 'surname', 'email')
    list_filter = ('user_type', 'is_active', 'is_confirmed')
    ordering = ('-is_active', 'name')
    fieldsets = (
        (None, {'fields': ('email', 'password', 'name', 'surname')}),
        ('Permissions', {'fields': ('is_active', 'is_confirmed', 'user_type')}),
        ('Additional Info', {'fields': ('info',)}),
    )
    readonly_fields = ('is_confirmed',)


class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'legal_name', 'owner', 'description', 'website', 'created_at')
    search_fields = ('name', 'legal_name', 'owner__email')
    list_filter = ('created_at',)
    ordering = ('-created_at',)


class OfficeAdmin(admin.ModelAdmin):
    list_display = ('address', 'city', 'country', 'postal_code', 'phone_number', 'manager', 'company')
    search_fields = ('address', 'city', 'manager__email', 'company__name')
    list_filter = ('country', 'city')


class UtilitiesAdmin(admin.ModelAdmin):
    list_display = ('utilities_type', 'date', 'counter', 'price', 'office')
    search_fields = ('office__address', 'office__company__name')
    list_filter = ('utilities_type', 'date')
    ordering = ('-date',)


class ProviderAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'address', 'phone_number', 'email', 'bank_details')
    search_fields = ('name', 'company__name', 'email')
    list_filter = ('company',)


class OrderAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'deal_value', 'currency', 'provider', 'office')
    search_fields = ('title', 'provider__name', 'office__address')
    list_filter = ('currency', 'provider', 'office')
    ordering = ('-deal_value',)
    readonly_fields = ('file',)


# Registering models to the admin site
admin.site.register(User, UserAdmin)
admin.site.register(Company, CompanyAdmin)
admin.site.register(Office, OfficeAdmin)
admin.site.register(Utilities, UtilitiesAdmin)
admin.site.register(Provider, ProviderAdmin)
admin.site.register(Order, OrderAdmin)
