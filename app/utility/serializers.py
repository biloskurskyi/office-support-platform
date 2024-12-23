from datetime import timedelta

from django.db import models  # Імпортуємо models
from rest_framework import serializers

from core.models import Utilities


class UtilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilities
        fields = ['id', 'utilities_type', 'date', 'counter', 'price', 'office']
        read_only_fields = ['id']

    def validate(self, data):
        office = data.get('office')
        utilities_type = data.get('utilities_type')
        new_counter = data.get('counter')
        new_date = data.get('date')

        if not new_date or not office or utilities_type is None:
            raise serializers.ValidationError({"error": "Missing required fields: date, office, or utilities_type."})

        # Заборонити більше одного запису для WASTE_COLLECTION за один місяць
        if utilities_type == Utilities.WASTE_COLLECTION:
            if Utilities.objects.filter(
                    office=office,
                    utilities_type=utilities_type,
                    date__year=new_date.year,
                    date__month=new_date.month
            ).exists():
                raise serializers.ValidationError({
                    "error": f"WASTE_COLLECTION record for {new_date.strftime('%Y-%m')} already exists."
                })

            # Автоматичне управління `counter` для WASTE_COLLECTION
            max_counter = Utilities.objects.filter(
                office=office,
                utilities_type=utilities_type
            ).aggregate(max_counter=models.Max('counter'))['max_counter'] or 0
            data['counter'] = max_counter + 1
            return data

        # Для всіх інших типів (не WASTE_COLLECTION), виконувати перевірку по даті та рахунку

        # Забезпечити, щоб `counter` був обов'язковим
        if new_counter is None:
            raise serializers.ValidationError({"counter": "Counter value is required."})

        # Перевірка на коректність значення `counter` по даті
        previous_utility = Utilities.objects.filter(
            office=office,
            utilities_type=utilities_type,
            date__lt=new_date
        ).order_by('-date').first()

        if previous_utility and new_counter <= previous_utility.counter:
            raise serializers.ValidationError({
                "counter": f"Counter value must be greater than the previous month's value of "
                           f"{previous_utility.counter}."
            })

        # Перевірка на коректність значення `counter` для наступного запису по даті
        next_utility = Utilities.objects.filter(
            office=office,
            utilities_type=utilities_type,
            date__gt=new_date
        ).order_by('date').first()

        if next_utility and new_counter >= next_utility.counter:
            raise serializers.ValidationError({
                "counter": f"Counter value must be less than the next month's value of {next_utility.counter}."
            })

        return data


class GetUtilitySerializer(serializers.ModelSerializer):
    utilities_type_display = serializers.SerializerMethodField()
    office_display = serializers.CharField(source='office.__str__')

    class Meta:
        model = Utilities
        fields = ['id', 'utilities_type_display', 'date', 'counter', 'price', 'office_display']
        read_only_fields = ['id']

    def get_utilities_type_display(self, obj):
        return obj.get_utilities_type_display()
