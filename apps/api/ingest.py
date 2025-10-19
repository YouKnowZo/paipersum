import io, subprocess, tempfile
from pdfminer.high_level import extract_text
import pytesseract
from PIL import Image

def pdf_text(path: str) -> str:
    try:
        return extract_text(path)
    except Exception:
        # rasterize first page as fallback
        with tempfile.NamedTemporaryFile(suffix='.png') as tmp:
            subprocess.run(['pdftoppm','-png',path,tmp.name[:-4]], check=True)
            img = Image.open(tmp.name)
            return pytesseract.image_to_string(img)
