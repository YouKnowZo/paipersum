"""Document ingestion: PDF, OCR, text extraction"""
import io
import subprocess
import tempfile
from pdfminer.high_level import extract_text
try:
    import pytesseract
    from PIL import Image
    HAS_OCR = True
except ImportError:
    HAS_OCR = False

def pdf_text(path: str) -> str:
    """Extract text from PDF, with OCR fallback"""
    try:
        # Try direct text extraction first
        text = extract_text(path)
        
        # If we got meaningful text, return it
        if text and len(text.strip()) > 100:
            return text
        
        # Otherwise try OCR if available
        if HAS_OCR:
            return _ocr_pdf(path)
        
        return text or ""
        
    except Exception as e:
        print(f"PDF extraction error: {e}")
        
        # Try OCR as fallback
        if HAS_OCR:
            try:
                return _ocr_pdf(path)
            except:
                pass
        
        return ""

def _ocr_pdf(path: str) -> str:
    """OCR a PDF using tesseract"""
    if not HAS_OCR:
        return ""
    
    try:
        # Convert first page to image and OCR it
        # This is a simplified version - in production, process all pages
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            subprocess.run(
                ['pdftoppm', '-png', '-f', '1', '-l', '1', path, tmp.name[:-4]],
                check=True,
                capture_output=True
            )
            img_path = tmp.name
        
        img = Image.open(img_path)
        text = pytesseract.image_to_string(img)
        
        return text
        
    except Exception as e:
        print(f"OCR error: {e}")
        return ""
