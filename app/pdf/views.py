import os
from datetime import datetime
from io import BytesIO
from django.db.models import Q
from django.http import FileResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from company.serializers import CompanySerializer
from core.models import Company, User
from user.serializers import UserSerializer
from reportlab.lib.units import inch

import textwrap


def wrap_text(pdf, title, subtitle, data, item_fields):
    width, height = letter
    margin = inch
    line_height = 14
    max_line_width = width - 2 * margin  # Максимальна ширина тексту
    wrap_width = int(max_line_width / 7)  # Приблизна кількість символів на рядок

    pdf.setFont("DejaVuSans-Bold", 20)
    pdf.drawCentredString(width / 2, height - margin, title)
    page_y = height - margin - line_height * 2

    pdf.setFont("DejaVuSans", 14)
    pdf.drawCentredString(width / 2, page_y, subtitle)
    page_y -= line_height * 2

    pdf.line(margin, page_y, width - margin, page_y)
    page_y -= line_height

    for item in data:
        if page_y < margin + 2 * line_height:
            pdf.showPage()
            pdf.setFont("DejaVuSans", 12)
            page_y = height - margin

        page_y -= 20

        for field_name, field_label in item_fields:
            text = f"{field_label}: {item.get(field_name, '')}"
            wrapped_text = textwrap.wrap(text, width=wrap_width)

            for line in wrapped_text:
                pdf.drawString(margin, page_y, line)
                page_y -= line_height
                if page_y < margin + line_height:
                    pdf.showPage()
                    pdf.setFont("DejaVuSans", 12)
                    page_y = height - margin - line_height

            page_y -= 10

        pdf.line(margin, page_y, width - margin, page_y)
        page_y -= line_height

    total_pages = pdf.getPageNumber()
    for page_num in range(1, total_pages + 1):
        pdf.showPage()
        pdf.setFont("DejaVuSans", 14)
        pdf.drawString(480, 20, f"Сторінка {page_num} з {total_pages}")
        pdf.drawString(200, 20, f"Офісна Мозаїка {datetime.now().year} UA")

    pdf.save()


def generate_pdf(title, subtitle, data, item_fields):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)

    font_path = os.path.join(os.path.dirname(__file__), 'fonts', 'DejaVuSans.ttf')
    pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))
    pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', font_path))

    pdf.setFont("DejaVuSans", 12)
    wrap_text(pdf, title, subtitle, data, item_fields)
    buffer.seek(0)
    return buffer


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
