import json
import urllib.request
from decimal import Decimal

from django.db.models import Avg, Count, Max, Min, Q, Sum
from django.http import FileResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from company.serializers import CompanySerializer
from core.models import Company, Office, Order, Provider, User, Utilities
from office.serializers import OfficeSerializer
from order.mixins import OfficePermissionMixin
from order.serializers import OrderSerializer
from provider.mixins import ProviderPermissionMixin
from provider.serializers import ProviderSerializer
from user.serializers import UserSerializer
from utility.serializers import GetUtilitySerializer

from .static.template import generate_pdf


class CompanyPDFView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.user_type != User.OWNER_USER:
            return Response({'detail': 'You do not have permission to get companies.'},
                            status=status.HTTP_403_FORBIDDEN)

        companies = Company.objects.filter(owner=request.user.id)
        serializer = CompanySerializer(companies, many=True)
        if not companies.exists():
            return Response({"message": "No posts found for this user"}, status=200)

        statistics = {
            "Електрона адреса власника": request.user.email,
            "Кількість компаній": companies.count(),
            "Компанії": {}
        }

        for company in companies:
            managers_count = User.objects.filter(
                Q(user_type=User.MANAGER_USER) & Q(company=company.id)
            ).count()

            offices_count = Office.objects.filter(company=company).count()

            total_deals_value = Order.objects.filter(
                office__company=company
            ).aggregate(total_value=Sum('deal_value'))['total_value'] or 0

            # Кількість замовлень для компанії
            orders_count = Order.objects.filter(office__company=company).count()

            # Загальна кількість комунальних послуг
            utilities_count = Utilities.objects.filter(office__company=company).count()

            statistics["Компанії"][company.name] = [
                f"{managers_count} - кількість менеджерів",
                f"{offices_count} - кількість офісів",
                f"{orders_count} - кількість замовлень",
                f"{utilities_count} - кількість комунальних послуг",
                f"{total_deals_value} гривень - загальна вартість угод"
            ]

        print(statistics)

        item_fields = [
            ('name', 'Назва компанії'),
            ('legal_name', 'Юридична назва'),
            ('description', 'Опис'),
            ('website', 'Вебсайт')
        ]
        pdf_buffer = generate_pdf(
            title="Звіт по компаніях",
            subtitle="Детальна інформація про компанії",
            data=serializer.data,
            item_fields=item_fields,
            statistics=statistics
        )
        response = FileResponse(pdf_buffer, as_attachment=True, filename='company_report.pdf')
        response['Content-Disposition'] = 'attachment; filename="company_report.pdf"'
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'
        print("Content-Disposition:", response['Content-Disposition'])
        return response


class CompanyManagersPDFView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, company_id):
        try:
            company = Company.objects.get(id=company_id)

            if company.owner != request.user:
                return Response({"error": "You are not the owner of this company."},
                                status=status.HTTP_403_FORBIDDEN)

            managers = User.objects.filter(
                Q(user_type=User.MANAGER_USER) & Q(company=company_id)
            )

            if not managers.exists():
                return Response({"message": "No managers found for this company"}, status=200)

            serializer = UserSerializer(managers, many=True)

            data = serializer.data

            for item in data:
                item['is_active'] = 'Активний' if item['is_active'] else 'Не активний'

            active_managers_count = managers.filter(is_active=True).count()
            inactive_managers_count = managers.filter(is_active=False).count()

            statistics = {
                "Кількість менеджерів": managers.count(),
                "Активних менеджерів": active_managers_count,
                "Неактивних менеджерів": inactive_managers_count,
            }

            item_fields = [
                ('name', 'Менеджер'),
                ('surname', 'Прізвище'),
                ('email', 'Електронна пошта'),
                ('info', 'Інформація'),
                ('is_active', 'Активний')
            ]
            pdf_buffer = generate_pdf(
                title="Звіт по менеджерах",
                subtitle=f"Менеджери компанії {company.name}",
                data=serializer.data,
                item_fields=item_fields,
                statistics=statistics
            )

            filename = f'manager_report_{company.name}.pdf'
            response = FileResponse(pdf_buffer, as_attachment=True, filename=filename)
            response['Content-Disposition'] = f'attachment; filename={filename}'
            response['Access-Control-Expose-Headers'] = 'Content-Disposition'

            return response

        except Company.DoesNotExist:
            return Response({"error": "Company not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class OfficeListForCompany(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, company_id):
        try:
            company = Company.objects.get(id=company_id)

            # Ensure the user is the owner of the company
            if company.owner != request.user:
                return Response({"error": "You are not the owner of this company."},
                                status=status.HTTP_403_FORBIDDEN)

            offices = Office.objects.filter(company=company)

            if not offices.exists():
                return Response({"message": "No offices found for this company"}, status=200)

            # Serializer for the offices
            serializer = OfficeSerializer(offices, many=True)

            item_fields = [
                ('country', 'Країна'),
                ('city', 'Місто'),
                ('address', 'Адреса'),
                ('postal_code', 'Поштовий індекс'),
                ('phone_number', 'Телефон'),
                ('company', 'Компанія')
            ]

            # Отримати офіси компанії
            offices = Office.objects.filter(company=company)

            if not offices.exists():
                return Response({"message": "No offices found for this company."}, status=200)

            # Загальна кількість офісів
            total_offices = offices.count()

            # Розподіл офісів за країнами
            country_distribution = offices.values('country').annotate(count=Count('country')).order_by('-count')

            # Кількість офісів із закріпленими менеджерами
            offices_with_managers = offices.filter(manager__isnull=False).count()

            # Кількість офісів без закріплених менеджерів
            offices_without_managers = total_offices - offices_with_managers

            # Детальна інформація про офіси
            office_data = []
            for office in offices:
                office_info = {
                    "Адреса": office.address,
                    "Місто": office.city,
                    "Країна": office.country,
                    "Поштовий код": office.postal_code or "N/A",
                    "Телефон": office.phone_number,
                }

                if office.manager:
                    office_info["Менеджер"] = f"{office.manager.name} {office.manager.surname} ({office.manager.email})"
                else:
                    office_info["Менеджер"] = "Не закріплений"

                office_data.append(office_info)

            # Статистика
            statistics = {
                "Загальна кількість офісів": total_offices,
                "Офіси з менеджерами": offices_with_managers,
                "Офіси без менеджерів": offices_without_managers,
                "Розподіл за країнами": {},
            }

            for item in country_distribution:
                print(item)
                statistics["Розподіл за країнами"][item["country"]] = [f"Кількість офісів: {item['count']}"]

            # Generate PDF
            pdf_buffer = generate_pdf(
                title="Звіт по офісах компанії",
                subtitle=f"Офіси компанії {company.name}",
                data=serializer.data,
                item_fields=item_fields,
                statistics=statistics,
            )

            filename = f'offices_report_{company.name}.pdf'
            response = FileResponse(pdf_buffer, as_attachment=True, filename=filename)
            response['Content-Disposition'] = f'attachment; filename={filename}'
            response['Access-Control-Expose-Headers'] = 'Content-Disposition'

            return response

        except Company.DoesNotExist:
            return Response({"error": "Company not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProvidersPDFView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk):
        response = ProviderPermissionMixin().check_provider_permissions(request, company_id=pk)
        if isinstance(response, Response):
            return response

        providers = Provider.objects.filter(company_id=pk)

        if not providers.exists():
            return Response({"message": "No providers found for this company"}, status=status.HTTP_200_OK)

        serializer = ProviderSerializer(providers, many=True)

        item_fields = [
            ('name', 'Назва провайдера'),
            ('address', 'Адреса'),
            ('phone_number', 'Телефон'),
            ('email', 'Електронна пошта'),
            ('bank_details', 'Банківські реквізити')
        ]

        company = Company.objects.get(pk=pk)

        total_providers = providers.count()

        # Відсоток провайдерів із банківськими реквізитами
        providers_with_bank_details = providers.filter(bank_details__isnull=False).exclude(bank_details="").count()
        bank_details_percentage = (providers_with_bank_details / total_providers) * 100 if total_providers > 0 else 0

        # Провайдери із заповненим телефоном, email або обома
        providers_with_phone = providers.filter(phone_number__isnull=False).exclude(phone_number="").count()
        providers_with_email = providers.filter(email__isnull=False).exclude(email="").count()
        providers_with_both = providers.filter(
            phone_number__isnull=False, email__isnull=False
        ).exclude(phone_number="").exclude(email="").count()

        # Найчастіше використовуваний домен електронної пошти
        email_domains = [provider.email.split("@")[-1] for provider in providers if provider.email]
        most_common_domain = max(set(email_domains), key=email_domains.count) if email_domains else "Немає даних"

        # Формуємо статистику
        statistics = {
            "Компанія": company.legal_name,
            "Загальна кількість провайдерів": total_providers,
            "Відсоток провайдерів із банківськими реквізитами": f"{bank_details_percentage:.2f}%",
            "Провайдери з телефоном": providers_with_phone,
            "Провайдери з email": providers_with_email,
            "Провайдери з телефоном і email": providers_with_both,
            "Найчастіший домен електронної пошти": most_common_domain,
        }

        pdf_buffer = generate_pdf(
            title="Звіт по провайдерах",
            subtitle=f"Провайдери компанії {company.legal_name}",
            data=serializer.data,
            item_fields=item_fields,
            statistics=statistics,
        )

        filename = f'providers_report_{company.legal_name}.pdf'
        response = FileResponse(pdf_buffer, as_attachment=True, filename=filename)
        response['Content-Disposition'] = f'attachment; filename={filename}'
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'
        return response


class OrdersPDFView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_exchange_rates(self):
        # Отримання курсу валют з API ПриватБанку
        url = "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5"
        try:
            with urllib.request.urlopen(url) as response:
                if response.status == 200:  # Використовується атрибут 'status', а не 'status_code'
                    exchange_data = json.loads(response.read().decode('utf-8'))  # Декодуємо та парсимо JSON
                    rates = {rate['ccy']: Decimal(rate['sale']) for rate in exchange_data}
                    # print(rates)
                    return rates
        except Exception as e:
            # Логування помилки для дебагу
            print(f"Error fetching exchange rates: {e}")

        # Повертаємо дефолтні курси у випадку помилки
        return {"USD": Decimal(42.3), "EUR": Decimal(44.25)}

    def get(self, request, pk):
        user = request.user
        office_id = pk

        # Перевірка доступу до офісу
        office = OfficePermissionMixin().check_office_permission(user, office_id)

        # Отримання замовлень для офісу
        orders = Order.objects.filter(office=office_id)
        if not orders.exists():
            return Response({"message": "No orders found for this office."}, status=status.HTTP_200_OK)

        serializer = OrderSerializer(orders, many=True)

        exchange_rates = self.get_exchange_rates()

        # Аналіз замовлень
        total_cost_uah = Decimal(0)
        orders_count = orders.count()
        orders_by_currency = {currency[1]: 0 for currency in Order.CURRENCY_TYPE_CHOICES}
        total_cost_by_currency = {currency[1]: Decimal(0) for currency in Order.CURRENCY_TYPE_CHOICES}

        for order in orders:
            orders_by_currency[order.get_currency_display()] += 1
            if order.currency == Order.USD:
                total_cost_uah += order.deal_value * exchange_rates.get("USD")
                total_cost_by_currency["Долар США"] += order.deal_value * exchange_rates.get("USD")
            elif order.currency == Order.EUR:
                total_cost_uah += order.deal_value * exchange_rates.get("EUR")
                total_cost_by_currency["Євро"] += order.deal_value * exchange_rates.get("EUR")
            else:  # UAH
                total_cost_uah += order.deal_value
                total_cost_by_currency["Гривня"] += order.deal_value

        average_order_value = total_cost_uah / orders_count if orders_count > 0 else Decimal(0)

        # Статистика
        statistics = {
            "Загальна кількість замовлень": orders_count,
            "Сума витрат (грн)": f"{total_cost_uah:.2f}",
            "Середня сума замовлення (грн)": f"{average_order_value:.2f}",
            "Статистика по валютам": {},
        }

        for currency, count in orders_by_currency.items():
            statistics["Статистика по валютам"][currency] = [
                f"Кількість замовлень за валютами {count}",
                f"Сума витрат: {total_cost_by_currency[currency]:.2f} грн",
                f"Середня сума замовлення: {total_cost_by_currency[currency] / count:.2f}"

            ]

        # Генерація звіту
        item_fields = [
            ('title', 'Назва замовлення'),
            ('description', 'Опис'),
            ('deal_value', 'Сума угоди'),
            ('currency_name', 'Валюта'),
            ('provider_name', 'Провайдер'),
            ('office_phone_number', 'Телефон офісу'),
        ]

        pdf_buffer = generate_pdf(
            title="Звіт по замовленнях",
            subtitle=f"Замовлення для офісу {office.address}, {office.city}, {office.country}",
            data=serializer.data,
            item_fields=item_fields,
            statistics=statistics,
        )

        filename = f'orders_report_{office.city}_{office.phone_number}.pdf'
        response = FileResponse(pdf_buffer, as_attachment=True, filename=filename)
        response['Content-Disposition'] = f'attachment; filename={filename}'
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'
        return response


def get_utility_type_in_english(utility_type_display):
    mapping = {
        'Опалення': 'Heating',
        'Водопостачання': 'Water_supply',
        'Газопостачання': 'Gas_supply',
        'Електропостачання': 'Electricity_supply',
        'Збір відходів': 'Waste_collection',
    }
    return mapping.get(utility_type_display, 'unknown')


class UtilitiesPDFView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, office_id, utility_type):
        user = request.user
        office = OfficePermissionMixin().check_office_permission(user, office_id)

        utilities = Utilities.objects.filter(office=office, utilities_type=utility_type).order_by('-date')

        if not utilities.exists():
            return Response({"message": "No utilities found for this office and type."}, status=status.HTTP_200_OK)

        serializer = GetUtilitySerializer(utilities, many=True)

        if utilities.exists():
            first_utility = GetUtilitySerializer(utilities.first()).data
            utility_type_display = first_utility.get('utilities_type_display', 'Комунальні послуги')
        else:
            utility_type_display = "Комунальні послуги"

        # Генерація PDF
        item_fields = [
            ('date', 'Дата'),
            ('counter', 'Лічильник'),
            ('price', 'Ціна'),
        ]

        total_cost = utilities.aggregate(total=Sum('price'))['total'] or 0
        average_cost = utilities.aggregate(avg=Avg('price'))['avg'] or 0
        max_cost = utilities.aggregate(max_price=Max('price'))['max_price'] or 0
        min_cost = utilities.aggregate(min_price=Min('price'))['min_price'] or 0
        total_records = utilities.count()
        first_date = utilities.aggregate(first_date=Min('date'))['first_date']
        last_date = utilities.aggregate(last_date=Max('date'))['last_date']

        # Розширення статистики
        statistics = {
            "Тип послуги": dict(Utilities.UTILITIES_TYPE_CHOICES).get(utility_type, "Невідомий"),
            "Загальна вартість": f"{total_cost:.2f} грн",
            "Середня вартість": f"{average_cost:.2f} грн",
            "Максимальна вартість": f"{max_cost:.2f} грн",
            "Мінімальна вартість": f"{min_cost:.2f} грн",
            "Кількість записів": total_records,
            "Найраніша дата запису": first_date,
            "Остання дата запису": last_date,
        }

        pdf_buffer = generate_pdf(
            title="Звіт по комунальних послугах",
            subtitle=f"Тип послуги: {utility_type_display}, Офіс: {office.address}, {office.city}, {office.country}",
            data=serializer.data,
            item_fields=item_fields,
            statistics=statistics,
        )

        print(utility_type_display)
        """((HEATING, 'Опалення'),
                              (WATER_SUPPLY, 'Водопостачання'),
                              (GAS_SUPPLY, 'Газопостачання'),
                              (ELECTRICITY_SUPPLY, 'Електропостачання'),
                              (WASTE_COLLECTION, 'Збір відходів'),)"""

        filename = (f'utilities_report_'
                    f'{get_utility_type_in_english(utility_type_display)}_{office.city}_{office.phone_number}.pdf')
        response = FileResponse(pdf_buffer, as_attachment=True, filename=filename)
        response['Content-Disposition'] = f'attachment; filename={filename}'
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'
        return response


class OfficeListManagerPDFView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        offices = Office.objects.filter(manager=user.id)
        if not offices.exists():
            return Response({"message": "No offices found for you"}, status=200)
        serializer = OfficeSerializer(offices, many=True)

        # Додавання статистики
        total_offices = offices.count()

        # Форматування статистики
        statistics = {
            "Загальна кількість офісів": total_offices,
            "Розподіл за країнами": {},
        }

        country_distribution = offices.values('country').annotate(count=Count('country')).order_by('-count')

        print(country_distribution)

        for item in country_distribution:
            print(item)
            statistics["Розподіл за країнами"][item["country"]] = [f"Кількість офісів: {item['count']}"]

        item_fields = [
            ('country', 'Країна'),
            ('city', 'Місто'),
            ('address', 'Адреса'),
            ('postal_code', 'Поштовий індекс'),
            ('phone_number', 'Телефон'),
            ('company', 'Компанія')
        ]

        pdf_buffer = generate_pdf(
            title="Звіт по офісах компанії",
            subtitle=f"Менеджер: {user.name} {user.surname}",
            data=serializer.data,
            item_fields=item_fields,
            statistics=statistics
        )

        filename = 'offices_report.pdf'
        response = FileResponse(pdf_buffer, as_attachment=True, filename=filename)
        response['Content-Disposition'] = f'attachment; filename={filename}'
        response['Access-Control-Expose-Headers'] = 'Content-Disposition'

        return response
