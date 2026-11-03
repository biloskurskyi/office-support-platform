from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase

from core.validators import validate_pdf


class ValidatePdfTests(SimpleTestCase):
    def test_pdf_ok(self):
        validate_pdf(SimpleUploadedFile('a.pdf', b'%PDF-1.4 content'))

    def test_text_with_pdf_extension_rejected(self):
        with self.assertRaises(ValidationError):
            validate_pdf(SimpleUploadedFile('a.pdf', b'just text'))
