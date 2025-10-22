import re
import io
import tempfile
from typing import List, Dict, Any
import asyncio
from concurrent.futures import ThreadPoolExecutor
import logging

# Document processing imports
import pytesseract
from pdfminer.high_level import extract_text
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from PIL import Image
import docx
from io import BytesIO

# ML imports
try:
    from transformers import pipeline
    import torch
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False
    logging.warning("ML libraries not available, falling back to regex analysis")

logger = logging.getLogger(__name__)

# Regex-based analysis rules (fallback)
LEGAL_RULES = [
    (r"indemnif(y|ication)", "Indemnification", "You must defend and pay for the other party if something goes wrong.", 'red'),
    (r"waive|release|hold harmless", "Release/Waiver", "You give up rights to sue or recover damages.", 'red'),
    (r"arbitration|binding arbitration", "Arbitration", "Disputes must go to arbitration instead of court.", 'yellow'),
    (r"class action", "Class Action Waiver", "You cannot join class actions.", 'yellow'),
    (r"auto[- ]?renew|automatically renew", "Auto-Renewal", "The agreement renews unless you cancel.", 'yellow'),
    (r"as is|no warranties|without warranty", "No Warranty", "The provider disclaims responsibility for quality or fitness.", 'yellow'),
    (r"governing law|venue|jurisdiction", "Governing Law/Venue", "Which court/law applies is predefined.", 'green'),
    (r"share .* data|third[- ]?part(y|ies) .* data|sell .* data", "Data Sharing", "Your data may be shared or sold to third parties.", 'yellow'),
    (r"assume .* risk|at (my|your) sole risk", "Assumption of Risk", "You accept all risks of harm.", 'red'),
    (r"limitation of liability|limit.*liability", "Limitation of Liability", "Your ability to recover damages is limited.", 'yellow'),
    (r"force majeure", "Force Majeure", "The party is excused from performance due to circumstances beyond their control.", 'green'),
    (r"termination|terminate", "Termination", "Conditions under which the agreement can be ended.", 'yellow'),
    (r"confidentiality|confidential", "Confidentiality", "Information must be kept secret.", 'yellow'),
    (r"intellectual property|ip rights", "Intellectual Property", "Rights to patents, copyrights, trademarks, etc.", 'green'),
    (r"severability", "Severability", "If one part is invalid, the rest remains in effect.", 'green'),
]

RISK_WEIGHTS = {'red': 30, 'yellow': 12, 'green': 4}

# ML model (lazy loading)
_classifier = None

def get_classifier():
    global _classifier
    if _classifier is None and ML_AVAILABLE:
        try:
            _classifier = pipeline(
                'zero-shot-classification',
                model='facebook/bart-large-mnli',
                device=0 if torch.cuda.is_available() else -1
            )
        except Exception as e:
            logger.warning(f"Failed to load ML model: {e}")
            _classifier = False  # Mark as failed
    return _classifier

async def analyze_text(text: str) -> Dict[str, Any]:
    """Analyze legal text and return risk assessment"""
    try:
        # Try ML analysis first
        if ML_AVAILABLE:
            ml_result = await analyze_with_ml(text)
            if ml_result:
                return ml_result
        
        # Fallback to regex analysis
        return analyze_with_regex(text)
    
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        # Return safe fallback
        return {
            "risk_score": 0,
            "clauses": [],
            "confidence": 0.5
        }

async def analyze_with_ml(text: str) -> Dict[str, Any]:
    """Analyze text using ML model"""
    try:
        classifier = get_classifier()
        if not classifier:
            return None
        
        # Define legal clause categories
        categories = [
            "Indemnification",
            "Release/Waiver", 
            "Arbitration",
            "Class Action Waiver",
            "Auto-Renewal",
            "No Warranty",
            "Governing Law/Venue",
            "Data Sharing",
            "Assumption of Risk",
            "Limitation of Liability",
            "Force Majeure",
            "Termination",
            "Confidentiality",
            "Intellectual Property",
            "Severability"
        ]
        
        # Split text into chunks for processing
        chunk_size = 1000
        chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        
        clauses = []
        total_risk = 0
        
        for chunk in chunks:
            if len(chunk.strip()) < 50:  # Skip very short chunks
                continue
                
            try:
                result = classifier(chunk, categories, multi_label=True)
                
                for label, score in zip(result['labels'], result['scores']):
                    if score > 0.6:  # Confidence threshold
                        risk_level = get_risk_level_for_category(label)
                        citation = extract_sentence_around_match(chunk, label)
                        
                        clauses.append({
                            "title": label,
                            "summary": get_summary_for_category(label),
                            "risk": risk_level,
                            "citation": citation
                        })
                        
                        total_risk += RISK_WEIGHTS[risk_level]
            
            except Exception as e:
                logger.warning(f"ML analysis failed for chunk: {e}")
                continue
        
        # Calculate final risk score
        risk_score = min(100, max(0, total_risk))
        confidence = 0.8 if clauses else 0.5
        
        return {
            "risk_score": risk_score,
            "clauses": clauses,
            "confidence": confidence
        }
    
    except Exception as e:
        logger.error(f"ML analysis failed: {e}")
        return None

def analyze_with_regex(text: str) -> Dict[str, Any]:
    """Analyze text using regex patterns (fallback)"""
    clauses = []
    total_risk = 0
    
    for pattern, title, summary, risk in LEGAL_RULES:
        matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
        for match in matches:
            citation = extract_sentence_around_match(text, match.start())
            clauses.append({
                "title": title,
                "summary": summary,
                "risk": risk,
                "citation": citation
            })
            total_risk += RISK_WEIGHTS[risk]
    
    risk_score = min(100, max(0, total_risk))
    confidence = 0.75 if clauses else 0.5
    
    return {
        "risk_score": risk_score,
        "clauses": clauses,
        "confidence": confidence
    }

def get_risk_level_for_category(category: str) -> str:
    """Map category to risk level"""
    high_risk = ["Indemnification", "Release/Waiver", "Assumption of Risk"]
    medium_risk = ["Arbitration", "Class Action Waiver", "Auto-Renewal", "No Warranty", "Data Sharing", "Limitation of Liability", "Termination", "Confidentiality"]
    
    if category in high_risk:
        return 'red'
    elif category in medium_risk:
        return 'yellow'
    else:
        return 'green'

def get_summary_for_category(category: str) -> str:
    """Get human-readable summary for category"""
    summaries = {
        "Indemnification": "You must defend and pay for the other party if something goes wrong.",
        "Release/Waiver": "You give up rights to sue or recover damages.",
        "Arbitration": "Disputes must go to arbitration instead of court.",
        "Class Action Waiver": "You cannot join class actions.",
        "Auto-Renewal": "The agreement renews unless you cancel.",
        "No Warranty": "The provider disclaims responsibility for quality or fitness.",
        "Governing Law/Venue": "Which court/law applies is predefined.",
        "Data Sharing": "Your data may be shared or sold to third parties.",
        "Assumption of Risk": "You accept all risks of harm.",
        "Limitation of Liability": "Your ability to recover damages is limited.",
        "Force Majeure": "The party is excused from performance due to circumstances beyond their control.",
        "Termination": "Conditions under which the agreement can be ended.",
        "Confidentiality": "Information must be kept secret.",
        "Intellectual Property": "Rights to patents, copyrights, trademarks, etc.",
        "Severability": "If one part is invalid, the rest remains in effect."
    }
    return summaries.get(category, "Legal clause identified.")

def extract_sentence_around_match(text: str, match_pos: int) -> str:
    """Extract sentence containing the match"""
    # Find sentence boundaries
    start = max(0, text.rfind('.', 0, match_pos) + 1)
    end = text.find('.', match_pos)
    if end == -1:
        end = min(len(text), match_pos + 200)
    
    sentence = text[start:end].strip()
    return sentence[:300]  # Limit length

async def analyze_file_content(content: bytes, filename: str, mime_type: str) -> Dict[str, Any]:
    """Extract text from file and analyze"""
    try:
        # Extract text based on file type
        text = await extract_text_from_file(content, filename, mime_type)
        
        if not text.strip():
            raise ValueError("No text could be extracted from the file")
        
        # Analyze the extracted text
        return await analyze_text(text)
    
    except Exception as e:
        logger.error(f"File analysis error: {e}")
        raise ValueError(f"Failed to analyze file: {str(e)}")

async def extract_text_from_file(content: bytes, filename: str, mime_type: str) -> str:
    """Extract text from various file formats"""
    file_ext = filename.lower().split('.')[-1]
    
    try:
        if file_ext == 'pdf':
            return await extract_pdf_text(content)
        elif file_ext in ['doc', 'docx']:
            return extract_docx_text(content)
        elif file_ext == 'txt':
            return content.decode('utf-8', errors='ignore')
        else:
            raise ValueError(f"Unsupported file type: {file_ext}")
    
    except Exception as e:
        logger.error(f"Text extraction error: {e}")
        raise ValueError(f"Failed to extract text: {str(e)}")

async def extract_pdf_text(content: bytes) -> str:
    """Extract text from PDF using pdfminer"""
    try:
        # Try pdfminer first
        with BytesIO(content) as pdf_file:
            text = extract_text(pdf_file)
            if text.strip():
                return text
        
        # Fallback to OCR if pdfminer fails
        return await extract_pdf_text_ocr(content)
    
    except Exception as e:
        logger.warning(f"PDF extraction failed: {e}")
        return await extract_pdf_text_ocr(content)

async def extract_pdf_text_ocr(content: bytes) -> str:
    """Extract text from PDF using OCR (fallback)"""
    try:
        # This would require pdf2image and other dependencies
        # For now, return a placeholder
        return "PDF text extraction via OCR not yet implemented"
    except Exception as e:
        logger.error(f"OCR extraction failed: {e}")
        raise ValueError("Failed to extract text from PDF")

def extract_docx_text(content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(BytesIO(content))
        text = []
        for paragraph in doc.paragraphs:
            text.append(paragraph.text)
        return '\n'.join(text)
    except Exception as e:
        logger.error(f"DOCX extraction failed: {e}")
        raise ValueError("Failed to extract text from DOCX file")