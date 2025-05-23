# Generated by Django 4.2 on 2024-10-31 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_alter_provider_bank_account_number_iban_and_more'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='provider',
            name='unique_iban_per_company',
        ),
        migrations.RemoveField(
            model_name='provider',
            name='bank_account_number_IBAN',
        ),
        migrations.AddField(
            model_name='provider',
            name='bank_details',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='provider',
            name='name',
            field=models.CharField(max_length=64),
        ),
        migrations.AddConstraint(
            model_name='provider',
            constraint=models.UniqueConstraint(fields=('company', 'bank_details'), name='unique_iban_per_company'),
        ),
    ]
