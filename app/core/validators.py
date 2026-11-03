from django.conf import settings
from django.core.exceptions import ValidationError

PDF_SIGNATURE = b'%PDF-'


def validate_pdf(file) -> None:
    """Checks the size limit and the real %PDF- signature, not just the extension."""
    max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
    if file.size > max_bytes:
        raise ValidationError(f'File is larger than {settings.MAX_UPLOAD_MB} MB.')
    position = file.tell() if hasattr(file, 'tell') else 0
    file.seek(0)
    header = file.read(len(PDF_SIGNATURE))
    file.seek(position)
    if header != PDF_SIGNATURE:
        raise ValidationError('File is not a valid PDF.')
