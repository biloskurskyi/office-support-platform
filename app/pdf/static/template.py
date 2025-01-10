import os
import textwrap
from datetime import datetime
from io import BytesIO

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


def wrap_text_with_fixed_footer(pdf, title, subtitle, data, item_fields):
    width, height = letter
    margin = inch
    line_height = 14
    max_line_width = width - 2 * margin
    wrap_width = int(max_line_width / 7)

    def draw_footer(page_num, total_pages):
        pdf.setFont("DejaVuSans", 13)
        footer_y = 30  # Відстань від нижнього краю сторінки
        pdf.drawString(margin, footer_y, f"Офісна Мозаїка {datetime.now().year} UA")
        pdf.drawString(width - 2 * inch, footer_y, f"Сторінка {page_num} з {total_pages}")

    # Initialize page variables
    current_y = height - margin
    page_num = 1

    # Title and Subtitle (only on the first page)
    pdf.setFont("DejaVuSans-Bold", 22)
    pdf.drawCentredString(width / 2, current_y, title)
    current_y -= line_height * 2

    pdf.setFont("DejaVuSans", 18)
    pdf.drawCentredString(width / 2, current_y, subtitle)
    current_y -= line_height * 2
    pdf.line(margin, current_y, width - margin, current_y)
    current_y -= line_height

    pdf.setFont("DejaVuSans", 14)

    total_pages = 1  # Estimated total pages (updated dynamically)

    # Content rendering
    for item in data:

        current_y -= 20

        for field_name, field_label in item_fields:
            text = f"{field_label}: {item.get(field_name, '')}"
            wrapped_text = textwrap.wrap(text, width=wrap_width)

            for line in wrapped_text:
                if current_y < margin + 2 * line_height:
                    # Draw footer and start a new page
                    draw_footer(page_num, total_pages)
                    pdf.showPage()
                    page_num += 1
                    current_y = height - margin

                    # Reset fonts for the new page
                    pdf.setFont("DejaVuSans", 16)

                pdf.drawString(margin, current_y, line)
                current_y -= line_height

            current_y -= 10  # Space between fields

        pdf.line(margin, current_y, width - margin, current_y)
        current_y -= line_height

        if current_y < margin + 2 * line_height:
            draw_footer(page_num, total_pages)
            pdf.showPage()
            page_num += 1
            current_y = height - margin
            pdf.setFont("DejaVuSans", 12)

    total_pages = page_num  # Final page count

    # Draw final footer for the last page
    draw_footer(page_num, total_pages)


def generate_pdf(title, subtitle, data, item_fields):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)

    font_path = os.path.join(os.path.dirname(__file__), 'fonts', 'DejaVuSans.ttf')
    pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))
    pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', font_path))

    pdf.setFont("DejaVuSans", 12)
    wrap_text_with_fixed_footer(pdf, title, subtitle, data, item_fields)
    pdf.save()
    buffer.seek(0)
    return buffer
