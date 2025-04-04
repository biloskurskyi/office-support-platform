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

        if new_date is None:
            new_date = self.instance.date
        if office is None:
            office = self.instance.office
        if utilities_type is None:
            utilities_type = self.instance.utilities_type

        if not new_date or not office or utilities_type is None:
            raise serializers.ValidationError({"error": "Відсутні обов'язкові поля: дата, офіс або тип послуги."})

        if Utilities.objects.filter(
                office=office,
                utilities_type=utilities_type,
                date__year=new_date.year,
                date__month=new_date.month
        ).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError({
                "error": f"Запис для даної послуги за {new_date.strftime('%Y-%m')} вже існує."
            })

        # Заборонити більше одного запису для WASTE_COLLECTION за один місяць
        if utilities_type == Utilities.WASTE_COLLECTION:
            if Utilities.objects.filter(
                    office=office,
                    utilities_type=utilities_type,
                    date__year=new_date.year,
                    date__month=new_date.month
            ).exists():
                raise serializers.ValidationError({
                    "error": f"Запис для Збору відходів за {new_date.strftime('%Y-%m')} вже існує."
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
            raise serializers.ValidationError({"counter": "Значення лічильника є обов'язковим."})

        # Перевірка на коректність значення `counter` по даті
        previous_utility = Utilities.objects.filter(
            office=office,
            utilities_type=utilities_type,
            date__lt=new_date
        ).order_by('-date').first()

        if previous_utility and new_counter < previous_utility.counter:
            raise serializers.ValidationError({
                "counter": f"Значення лічильника повинно бути більшим за попередній місяць: "
                           f"{previous_utility.counter}."
            })

        # Перевірка на коректність значення `counter` для наступного запису по даті
        next_utility = Utilities.objects.filter(
            office=office,
            utilities_type=utilities_type,
            date__gt=new_date
        ).order_by('date').first()

        if next_utility and new_counter > next_utility.counter:
            raise serializers.ValidationError({
                "counter": f"Значення лічильника повинно бути меншим за"
                           f" наступний місяць {next_utility.counter}."
            })

        return data


class GetUtilitySerializer(serializers.ModelSerializer):
    utilities_type_display = serializers.SerializerMethodField()
    utility_type_id = serializers.IntegerField(source='utilities_type')
    utility_id = serializers.IntegerField(source='id')
    office_display = serializers.CharField(source='office.__str__')
    office_id = serializers.IntegerField(source='office.id')

    class Meta:
        model = Utilities
        fields = ['utility_type_id', 'utilities_type_display', 'date', 'counter', 'price', 'office_display',
                  'office_id', 'utility_id']
        read_only_fields = ['utility_type_id', 'office_id', 'utility_id']

    def get_utilities_type_display(self, obj):
        return obj.get_utilities_type_display()
