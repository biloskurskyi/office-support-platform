import os
from datetime import datetime
from io import BytesIO

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


def generate_pdf(data):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)

    # Реєструємо шрифт
    font_path = os.path.join(os.path.dirname(__file__), 'fonts', 'DejaVuSans.ttf')
    pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))
    pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', font_path))

    # Встановлюємо шрифт для всього документа
    pdf.setFont("DejaVuSans", 12)

    header_y_position = 770  # Збільшуємо відступ зверху

    # Заголовок продукту (з відступом зверху)
    pdf.setTitle("Company Report")
    pdf.setFont("DejaVuSans-Bold", 16)

    # Текст заголовка
    text = "Офісна Мозаїка"

    # Обчислюємо ширину тексту
    text_width = pdf.stringWidth(text, "DejaVuSans-Bold", 16)

    # Визначаємо центр сторінки по горизонталі
    center_x = 612 / 2

    # Центруємо текст по осі X
    pdf.drawString(center_x - text_width / 2, header_y_position, text)

    report_text = "Звіт по компаніях"

    # Початковий заголовок
    pdf.setFont("DejaVuSans", 12)
    report_text_width = pdf.stringWidth(report_text, "DejaVuSans", 12)
    pdf.drawString(center_x - report_text_width / 2, header_y_position - 20, report_text)

    # Лінія під заголовком
    pdf.line(100, header_y_position - 25, 500, header_y_position - 25)

    # Відступ між компаніями
    y = 720
    line_spacing = 120  # Збільшуємо відступ між компаніями

    for index, item in enumerate(data):
        if y < 150:  # Перевірка для нової сторінки
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
