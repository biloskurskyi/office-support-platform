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


def generate_pdf(data):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)

    font_path = os.path.join(os.path.dirname(__file__), 'fonts', 'DejaVuSans.ttf')
    pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))
    pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', font_path))

    pdf.setFont("DejaVuSans", 12)

    header_y_position = 770

    pdf.setTitle("Company Report")
    pdf.setFont("DejaVuSans-Bold", 16)

    text = "Офісна Мозаїка"

    text_width = pdf.stringWidth(text, "DejaVuSans-Bold", 16)

    center_x = 612 / 2

    pdf.drawString(center_x - text_width / 2, header_y_position, text)

    report_text = "Звіт по компаніях"

    pdf.setFont("DejaVuSans", 12)
    report_text_width = pdf.stringWidth(report_text, "DejaVuSans", 12)
    pdf.drawString(center_x - report_text_width / 2, header_y_position - 20, report_text)

    pdf.line(100, header_y_position - 25, 500, header_y_position - 25)

    y = 720
    line_spacing = 120

    for index, item in enumerate(data):
        if y < 150:
            pdf.showPage()
            pdf.setFont("DejaVuSans", 12)
            pdf.drawString(230, 780, "Офісна Мозаїка")
            pdf.drawString(100, 750, "Звіт по компаніях")
            pdf.line(100, 745, 500, 745)

        pdf.drawString(100, y, f"Назва компанії: {item['name']}")
        pdf.drawString(100, y - 20, f"Юридична назва: {item['legal_name']}")
        pdf.drawString(100, y - 60, f"Опис: {item['description']}")
        pdf.drawString(100, y - 80, f"Вебсайт: {item['website']}")
        pdf.line(100, y - 85, 500, y - 85)
        y -= line_spacing

    # Додавання нумерації сторінок та footer
    total_pages = pdf.getPageNumber()
    for page_num in range(1, total_pages + 1):
        pdf.showPage()
        pdf.setFont("DejaVuSans", 10)
        pdf.drawString(500, 20, f"Сторінка {page_num} з {total_pages}")
        pdf.drawString(230, 20, f"Офісна Мозаїка {datetime.now().year} UA")

    pdf.save()
    buffer.seek(0)
    return buffer


class CompanyPDFView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.user_type != User.OWNER_USER:
            return Response({'detail': 'You do not have permission to get a companies.'},
                            status=status.HTTP_403_FORBIDDEN)

        companies = Company.objects.filter(owner=request.user.id)
        serializer = CompanySerializer(companies, many=True)
        if not companies.exists():
            return Response({"message": "No posts found for this user"}, status=200)

        pdf_buffer = generate_pdf(serializer.data)
        return FileResponse(pdf_buffer, as_attachment=True, filename='company_report.pdf')


def generate_pdf_for_managers(data):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)

    font_path = os.path.join(os.path.dirname(__file__), 'fonts', 'DejaVuSans.ttf')
    pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))
    pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', font_path))

    pdf.setFont("DejaVuSans", 12)

    header_y_position = 770

    pdf.setTitle("Managers Report")
    pdf.setFont("DejaVuSans-Bold", 16)

    text = "Офісна Мозаїка"

    text_width = pdf.stringWidth(text, "DejaVuSans-Bold", 16)

    center_x = 612 / 2

    pdf.drawString(center_x - text_width / 2, header_y_position, text)

    report_text = "Звіт по менеджерах"

    pdf.setFont("DejaVuSans", 12)
    report_text_width = pdf.stringWidth(report_text, "DejaVuSans", 12)
    pdf.drawString(center_x - report_text_width / 2, header_y_position - 20, report_text)

    pdf.line(100, header_y_position - 25, 500, header_y_position - 25)

    y = 720
    line_spacing = 120

    for index, item in enumerate(data):
        if y < 150:
            pdf.showPage()
            pdf.setFont("DejaVuSans", 12)
            pdf.drawString(230, 780, "Офісна Мозаїка")
            pdf.drawString(100, 750, "Звіт по менеджерах")
            pdf.line(100, 745, 500, 745)

        pdf.drawString(100, y, f"Менеджер: {item['name']} {item['surname']}")
        pdf.drawString(100, y - 20, f"Електронна пошта: {item['email']}")
        pdf.drawString(100, y - 40, f"Інформація: {item['info']}")
        pdf.drawString(100, y - 60, f"Компанія: {item['company']}")
        pdf.drawString(100, y - 80, f"Активний: {'Так' if item['is_active'] else 'Ні'}")
        pdf.line(100, y - 85, 500, y - 85)
        y -= line_spacing

    # Додавання нумерації сторінок та footer
    total_pages = pdf.getPageNumber()
    for page_num in range(1, total_pages + 1):
        pdf.showPage()
        pdf.setFont("DejaVuSans", 10)
        pdf.drawString(500, 20, f"Сторінка {page_num} з {total_pages}")
        pdf.drawString(230, 20, f"Офісна Мозаїка {datetime.now().year} UA")

    pdf.save()
    buffer.seek(0)
    return buffer


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

            # Якщо компанія не має менеджерів
            if not managers.exists():
                return Response({"message": "No managers found for this company"}, status=200)

            # Серіалізуємо дані
            serializer = UserSerializer(managers, many=True)
            pdf_buffer = generate_pdf_for_managers(serializer.data)

            return FileResponse(pdf_buffer, as_attachment=True, filename=f'manager_report_{company_id}.pdf')

        except Company.DoesNotExist:
            return Response({"error": "Company not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
