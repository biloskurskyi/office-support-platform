# Generated by Django 4.2 on 2024-11-01 15:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_rename_record_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='currency',
            field=models.SmallIntegerField(choices=[(0, 'Долар США'), (1, 'Євро'), (2, 'Гривня')], default=2),
        ),
    ]
