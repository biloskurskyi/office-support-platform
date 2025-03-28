import os
import textwrap
from datetime import datetime
from io import BytesIO

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


def wrap_text_with_fixed_footer(pdf, title, subtitle, data, item_fields, statistics=None):
    width, height = letter
    margin = inch
    line_height = 14
    max_line_width = width - 2 * margin
    wrap_width = int(max_line_width / 7)

    def draw_footer(page_num, total_pages):
        pdf.setFont("DejaVuSans", 13)
        footer_y = 30  # Відстань від нижнього краю сторінки
        pdf.drawString(margin, footer_y, f"Офісна Мозаїка {datetime.now().year} UA")
        pdf.drawString(width - 2 * inch, footer_y, f"Сторінка {page_num}")

    # Підготовка для підрахунку сторінок
    def simulate_page_count():
        simulated_pdf = canvas.Canvas(BytesIO(), pagesize=letter)
        current_y = height - margin
        page_num = 1

        simulated_pdf.setFont("DejaVuSans-Bold", 22)
        title_lines = textwrap.wrap(title, width=int(max_line_width / 10))
        for line in title_lines:
            current_y -= line_height * 2

        simulated_pdf.setFont("DejaVuSans", 18)
        subtitle_lines = textwrap.wrap(subtitle, width=int(max_line_width / 10))
        for line in subtitle_lines:
            current_y -= line_height * 2

        current_y -= line_height

        simulated_pdf.setFont("DejaVuSans", 14)

        for item in data:
            current_y -= 20
            for field_name, field_label in item_fields:
                text = f"{field_label}: {item.get(field_name, '')}"
                wrapped_text = textwrap.wrap(text, width=wrap_width)

                for line in wrapped_text:
                    if current_y < margin + 2 * line_height:
                        page_num += 1
                        current_y = height - margin

                    current_y -= line_height

                current_y -= 10

            current_y -= line_height

            if current_y < margin + 2 * line_height:
                page_num += 1
                current_y = height - margin

        if statistics:
            current_y -= 40
            for key, value in statistics.items():
                if isinstance(value, dict):
                    current_y -= line_height * 2
                    for sub_key, sub_values in value.items():
                        current_y -= line_height + 5
                        for sub_value in sub_values:
                            wrapped_text = textwrap.wrap(sub_value, width=wrap_width)
                            for line in wrapped_text:
                                if current_y < margin + 2 * line_height:
                                    page_num += 1
                                    current_y = height - margin

                                current_y -= line_height
                        current_y -= 20
                else:
                    wrapped_text = textwrap.wrap(f"{key}: {value}", width=wrap_width)
                    for line in wrapped_text:
                        if current_y < margin + 2 * line_height:
                            page_num += 1
                            current_y = height - margin

                        current_y -= line_height
                    current_y -= 20

        return page_num

    total_pages = simulate_page_count()

    # Основний рендеринг
    current_y = height - margin
    page_num = 1

    pdf.setFont("DejaVuSans-Bold", 22)
    title_lines = textwrap.wrap(title, width=int(max_line_width / 10))
    for line in title_lines:
        pdf.drawCentredString(width / 2, current_y, line)
        current_y -= line_height * 2

    pdf.setFont("DejaVuSans", 18)
    subtitle_lines = textwrap.wrap(subtitle, width=int(max_line_width / 10))
    for line in subtitle_lines:
        pdf.drawCentredString(width / 2, current_y, line)
        current_y -= line_height * 2

    pdf.line(margin, current_y, width - margin, current_y)
    current_y -= line_height

    pdf.setFont("DejaVuSans", 14)

    for item in data:
        current_y -= 20
        for field_name, field_label in item_fields:
            text = f"{field_label}: {item.get(field_name, '')}"
            wrapped_text = textwrap.wrap(text, width=wrap_width)

            for line in wrapped_text:
                if current_y < margin + 2 * line_height:
                    draw_footer(page_num, total_pages)
                    pdf.showPage()
                    page_num += 1
                    current_y = height - margin
                    pdf.setFont("DejaVuSans", 14)

                pdf.drawString(margin, current_y, line)
                current_y -= line_height

            current_y -= 10

        pdf.line(margin, current_y, width - margin, current_y)
        current_y -= line_height

        if current_y < margin + 2 * line_height:
            draw_footer(page_num, total_pages)
            pdf.showPage()
            page_num += 1
            current_y = height - margin
            pdf.setFont("DejaVuSans", 14)

    if statistics:
        pdf.setFont("DejaVuSans-Bold", 18)
        current_y -= 40
        pdf.drawString(margin, current_y, "Статистика:")
        current_y -= line_height * 2

        pdf.setFont("DejaVuSans", 14)
        for key, value in statistics.items():
            if isinstance(value, dict):
                pdf.drawString(margin, current_y, f"{key}:")
                current_y -= line_height * 2
                for sub_key, sub_values in value.items():
                    pdf.drawString(margin, current_y, f"  {sub_key}:")
                    current_y -= line_height + 5
                    for sub_value in sub_values:
                        wrapped_text = textwrap.wrap(sub_value, width=wrap_width)
                        for line in wrapped_text:
                            if current_y < margin + 2 * line_height:
                                draw_footer(page_num, total_pages)
                                pdf.showPage()
                                page_num += 1
                                current_y = height - margin
                                pdf.setFont("DejaVuSans", 14)

                            pdf.drawString(margin + 20, current_y, line)
                            current_y -= line_height
                    current_y -= 20
            else:
                wrapped_text = textwrap.wrap(f"{key}: {value}", width=wrap_width)
                for line in wrapped_text:
                    if current_y < margin + 2 * line_height:
                        draw_footer(page_num, total_pages)
                        pdf.showPage()
                        page_num += 1
                        current_y = height - margin
                        pdf.setFont("DejaVuSans", 14)

                    pdf.drawString(margin, current_y, line)
                    current_y -= line_height
                current_y -= 20

    draw_footer(page_num, total_pages)


def generate_pdf(title, subtitle, data, item_fields, statistics=None):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)

    font_path = os.path.join(os.path.dirname(__file__), 'fonts', 'DejaVuSans.ttf')
    pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))
    pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', font_path))

    pdf.setFont("DejaVuSans", 12)
    wrap_text_with_fixed_footer(pdf, title, subtitle, data, item_fields, statistics)
    pdf.save()
    buffer.seek(0)
    return buffer
