from datetime import date

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

        year = new_date.year
        month = new_date.month

        if Utilities.objects.filter(
                office=office,
                utilities_type=utilities_type,
                date__year=year,
                date__month=month
        ).exists():
            raise serializers.ValidationError({
                "error": "Utilities for this office and type already exist for this month."
            })

        previous_utility = Utilities.objects.filter(
            office=office,
            utilities_type=utilities_type,
            date__lt=new_date
        ).order_by('-date').first()

        if previous_utility and new_counter <= previous_utility.counter:
            raise serializers.ValidationError(
                {"counter": "Counter value must be greater than the previous month's value of {}.".format(
                    previous_utility.counter)}
            )

        return data
