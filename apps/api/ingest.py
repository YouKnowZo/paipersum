"""Document ingestion: PDF, DOCX, images, OCR, text extraction"""
import io
import subprocess
import tempfile
import os
from pathlib import Path
from pdfminer.high_level import extract_text

try:
    import pytesseract
    from PIL import Image
    HAS_OCR = True
except ImportError:
    HAS_OCR = False

try:
    import docx
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False

try:
    import fitz  # PyMuPDF
    HAS_PYMUPDF = True
except ImportError:
    HAS_PYMUPDF = False

def pdf_text(path: str) -> str:
    """Extract text from PDF, with OCR fallback"""
    try:
        # Try PyMuPDF first (better quality)
        if HAS_PYMUPDF:
            try:
                doc = fitz.open(path)
                text_parts = []
                for page in doc:
                    text_parts.append(page.get_text())
                doc.close()
                text = "\n".join(text_parts)
                if text and len(text.strip()) > 100:
                    return text
            except Exception as e:
                print(f"PyMuPDF extraction error: {e}")
        
        # Fallback to pdfminer
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
    """OCR a PDF using tesseract (all pages)"""
    if not HAS_OCR:
        return ""
    
    try:
        # Use PyMuPDF to convert pages to images if available
        if HAS_PYMUPDF:
            doc = fitz.open(path)
            text_parts = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                pix = page.get_pixmap()
                
                # Convert to PIL Image
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                
                # OCR
                page_text = pytesseract.image_to_string(img)
                text_parts.append(page_text)
            
            doc.close()
            return "\n".join(text_parts)
        else:
            # Fallback: use pdftoppm for first page only
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
                subprocess.run(
                    ['pdftoppm', '-png', '-f', '1', '-l', '1', path, tmp.name[:-4]],
                    check=True,
                    capture_output=True
                )
                img_path = tmp.name
            
            img = Image.open(img_path)
            text = pytesseract.image_to_string(img)
            os.unlink(img_path)
            return text
        
    except Exception as e:
        print(f"OCR error: {e}")
        return ""

def docx_to_text(path: str) -> str:
    """Extract text from DOCX file"""
    if not HAS_DOCX:
        return ""
    
    try:
        doc = docx.Document(path)
        text_parts = []
        
        # Extract paragraphs
        for para in doc.paragraphs:
            if para.text.strip():
                text_parts.append(para.text)
        
        # Extract tables
        for table in doc.tables:
            for row in table.rows:
                row_text = " | ".join([cell.text.strip() for cell in row.cells])
                if row_text.strip():
                    text_parts.append(row_text)
        
        return "\n".join(text_parts)
    except Exception as e:
        print(f"DOCX extraction error: {e}")
        return ""

def ocr_image(path: str) -> str:
    """Extract text from image using OCR"""
    if not HAS_OCR:
        return ""
    
    try:
        img = Image.open(path)
        text = pytesseract.image_to_string(img)
        return text
    except Exception as e:
        print(f"Image OCR error: {e}")
        return ""

def text_from_any(path: str) -> str:
    """
    Extract text from any supported file type
    
    Supported formats:
    - PDF (.pdf)
    - DOCX (.docx)
    - Images (.png, .jpg, .jpeg, .tiff, .bmp)
    - Plain text (.txt, .md, .html, etc.)
    """
    ext = Path(path).suffix.lower()
    
    if ext == '.pdf':
        return pdf_text(path)
    elif ext in ['.docx']:
        return docx_to_text(path)
    elif ext in ['.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif']:
        return ocr_image(path)
    else:
        # Plain text fallback
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
        except Exception as e:
            print(f"Text file read error: {e}")
            return ""
