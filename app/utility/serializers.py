from datetime import date, timedelta

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

        # Check for existing utilities with the same office, type, and month/year

        # Check if we're updating an existing instance
        instance_id = self.instance.id if self.instance else None

        if Utilities.objects.filter(
                office=office,
                utilities_type=utilities_type,
                date__year=year,
                date__month=month
        ).exclude(id=instance_id).exists():
            raise serializers.ValidationError({
                "error": "Utilities for this office and type already exist for this month."
            })

        # Check if counter is greater than the previous month's counter (if it exists)

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

        # Ensure sequential month addition if adding for a past month

        latest_utility = Utilities.objects.filter(
            office=office,
            utilities_type=utilities_type
        ).order_by('-date').last()

        # Check if it is utility for next month

        if latest_utility and new_date < latest_utility.date:
            next_date_expected = latest_utility.date - timedelta(days=latest_utility.date.day)
            while next_date_expected.year > new_date.year or (
                    next_date_expected.year == new_date.year and next_date_expected.month > new_date.month):
                if not Utilities.objects.filter(
                        office=office,
                        utilities_type=utilities_type,
                        date__year=next_date_expected.year,
                        date__month=next_date_expected.month
                ).exists():
                    raise serializers.ValidationError({
                        "error": f"Please add utility for {next_date_expected.strftime('%Y-%m')} "
                                 f"before adding {new_date.strftime('%Y-%m')}."
                    })
                next_date_expected -= timedelta(days=next_date_expected.day)

        # Check if counter is less than the next month's counter (if it exists)

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
