from django.db.models import Q
from django.http import FileResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from company.serializers import CompanySerializer
from core.models import Company, Office, Provider, User
from office.serializers import OfficeSerializer
from provider.mixins import ProviderPermissionMixin
from provider.serializers import ProviderSerializer
from user.serializers import UserSerializer

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
            item_fields=item_fields
        )
        return FileResponse(pdf_buffer, as_attachment=True, filename='company_report.pdf')


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
                item_fields=item_fields
            )
            return FileResponse(pdf_buffer, as_attachment=True, filename=f'manager_report_{company_id}.pdf')

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

            # Generate PDF
            pdf_buffer = generate_pdf(
                title="Звіт по офісах компанії",
                subtitle=f"Офіси компанії {company.name}",
                data=serializer.data,
                item_fields=item_fields
            )

            return FileResponse(pdf_buffer, as_attachment=True, filename=f'offices_report_{company_id}.pdf')

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

        pdf_buffer = generate_pdf(
            title="Звіт по провайдерах",
            subtitle=f"Провайдери компанії {company.legal_name}",
            data=serializer.data,
            item_fields=item_fields
        )

        return FileResponse(pdf_buffer, as_attachment=True, filename=f'providers_report_{pk}.pdf')
