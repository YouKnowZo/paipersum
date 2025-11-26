"""
Advanced AI Analysis Engine - Universal Document & Content Analyzer
Handles: Legal docs, contracts, PDFs, images, code, emails, reports, etc.
"""
from typing import Dict, List, Literal, Optional, Any
from pydantic import BaseModel
import re
from datetime import datetime

class AnalysisResult(BaseModel):
    """Universal analysis result"""
    document_type: str
    confidence: float
    risk_score: int  # 0-100
    sentiment: Literal['positive', 'neutral', 'negative']
    key_findings: List[str]
    summary: str
    recommendations: List[str]
    entities: List[Dict[str, str]]
    metadata: Dict[str, Any]

# Document type detection patterns
DOCUMENT_PATTERNS = {
    'legal_contract': [
        r'hereby agree', r'party of the first part', r'whereas', r'indemnif',
        r'jurisdiction', r'arbitration', r'governing law'
    ],
    'terms_of_service': [
        r'terms of service', r'user agreement', r'acceptable use',
        r'privacy policy', r'intellectual property', r'termination'
    ],
    'financial_report': [
        r'balance sheet', r'income statement', r'cash flow', r'revenue',
        r'fiscal year', r'financial position', r'assets', r'liabilities'
    ],
    'medical_record': [
        r'diagnosis', r'prescription', r'patient', r'symptoms', r'treatment',
        r'medical history', r'vital signs'
    ],
    'business_proposal': [
        r'executive summary', r'market analysis', r'competitive advantage',
        r'revenue model', r'financial projections', r'target market'
    ],
    'research_paper': [
        r'abstract', r'methodology', r'literature review', r'hypothesis',
        r'results', r'conclusion', r'references', r'peer[- ]review'
    ],
    'email': [
        r'subject:', r'from:', r'to:', r'dear', r'regards', r'sincerely'
    ],
    'code': [
        r'function\s+\w+', r'class\s+\w+', r'import\s+', r'def\s+\w+',
        r'public\s+class', r'const\s+\w+', r'return\s+'
    ],
    'news_article': [
        r'breaking news', r'reported', r'according to', r'sources say',
        r'journalist', r'press release'
    ],
    'social_media': [
        r'@\w+', r'#\w+', r'retweet', r'like', r'share', r'comment',
        r'follow', r'trending'
    ]
}

# Risk indicators for various document types
RISK_INDICATORS = {
    'legal': [
        (r'indemnif(y|ication)', 'Unlimited liability', 'red', 30),
        (r'waive|release|hold harmless', 'Waiver of rights', 'red', 30),
        (r'arbitration|binding arbitration', 'Forced arbitration', 'yellow', 15),
        (r'class action waiver', 'No class actions', 'yellow', 15),
        (r'auto[- ]?renew', 'Auto-renewal', 'yellow', 10),
        (r'as is|no warrant', 'No warranty', 'yellow', 10),
        (r'limit.* liability', 'Limited liability', 'yellow', 10),
    ],
    'financial': [
        (r'high[- ]risk', 'High risk investment', 'red', 25),
        (r'no guarantee', 'No guarantees', 'yellow', 15),
        (r'past performance.*not.*indicative', 'Performance disclaimer', 'yellow', 10),
        (r'may lose.*investment', 'Loss warning', 'red', 20),
    ],
    'privacy': [
        (r'share.*data.*third[- ]part', 'Data sharing', 'red', 25),
        (r'sell.*information', 'Data selling', 'red', 30),
        (r'track.*activity', 'Activity tracking', 'yellow', 15),
        (r'cookies.*marketing', 'Marketing cookies', 'yellow', 10),
    ]
}

def detect_document_type(text: str) -> tuple[str, float]:
    """Detect document type with confidence score"""
    text_lower = text.lower()
    scores = {}
    
    for doc_type, patterns in DOCUMENT_PATTERNS.items():
        matches = sum(1 for pattern in patterns if re.search(pattern, text_lower, re.IGNORECASE))
        scores[doc_type] = matches / len(patterns)
    
    if not scores or max(scores.values()) < 0.2:
        return 'general', 0.5
    
    best_type = max(scores.items(), key=lambda x: x[1])
    return best_type[0], best_type[1]

def extract_entities(text: str) -> List[Dict[str, str]]:
    """Extract named entities (simplified - use spaCy/transformers in production)"""
    entities = []
    
    # Email addresses
    emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    for email in set(emails):
        entities.append({'type': 'email', 'value': email})
    
    # Phone numbers
    phones = re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text)
    for phone in set(phones):
        entities.append({'type': 'phone', 'value': phone})
    
    # Dates
    dates = re.findall(r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b', text)
    for date in set(dates):
        entities.append({'type': 'date', 'value': date})
    
    # Currency amounts
    amounts = re.findall(r'\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?', text)
    for amount in set(amounts):
        entities.append({'type': 'currency', 'value': amount})
    
    # URLs
    urls = re.findall(r'https?://[^\s]+', text)
    for url in set(urls):
        entities.append({'type': 'url', 'value': url})
    
    return entities[:50]  # Limit to top 50

def calculate_sentiment(text: str) -> Literal['positive', 'neutral', 'negative']:
    """Simple sentiment analysis (upgrade to transformer model in production)"""
    text_lower = text.lower()
    
    positive_words = [
        'excellent', 'great', 'good', 'benefit', 'advantage', 'improve',
        'success', 'opportunity', 'valuable', 'guarantee', 'secure', 'protect'
    ]
    negative_words = [
        'risk', 'danger', 'waive', 'forfeit', 'penalty', 'liable', 'prohibited',
        'restrict', 'terminate', 'revoke', 'loss', 'damage', 'breach'
    ]
    
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)
    
    if neg_count > pos_count * 1.5:
        return 'negative'
    elif pos_count > neg_count * 1.5:
        return 'positive'
    else:
        return 'neutral'

def calculate_risk_score(text: str, doc_type: str) -> tuple[int, List[Dict]]:
    """Calculate risk score based on document type"""
    risk_categories = []
    total_risk = 0
    
    # Check legal risks if applicable
    if doc_type in ['legal_contract', 'terms_of_service']:
        for pattern, description, severity, weight in RISK_INDICATORS['legal']:
            if re.search(pattern, text, re.IGNORECASE):
                risk_categories.append({
                    'category': 'legal',
                    'description': description,
                    'severity': severity,
                    'weight': weight
                })
                total_risk += weight
    
    # Check financial risks
    if doc_type in ['financial_report', 'business_proposal']:
        for pattern, description, severity, weight in RISK_INDICATORS['financial']:
            if re.search(pattern, text, re.IGNORECASE):
                risk_categories.append({
                    'category': 'financial',
                    'description': description,
                    'severity': severity,
                    'weight': weight
                })
                total_risk += weight
    
    # Check privacy risks
    for pattern, description, severity, weight in RISK_INDICATORS['privacy']:
        if re.search(pattern, text, re.IGNORECASE):
            risk_categories.append({
                'category': 'privacy',
                'description': description,
                'severity': severity,
                'weight': weight
            })
            total_risk += weight
    
    return min(100, total_risk), risk_categories

def generate_summary(text: str, doc_type: str, max_length: int = 200) -> str:
    """Generate document summary (simplified - use transformer model in production)"""
    # Extract first few sentences as summary
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
    
    summary = ''
    for sentence in sentences[:3]:
        if len(summary) + len(sentence) < max_length:
            summary += sentence + '. '
        else:
            break
    
    if not summary:
        summary = text[:max_length] + '...'
    
    return summary.strip()

def generate_recommendations(
    doc_type: str,
    risk_score: int,
    risk_categories: List[Dict],
    sentiment: str
) -> List[str]:
    """Generate actionable recommendations"""
    recommendations = []
    
    if risk_score > 70:
        recommendations.append('⚠️ HIGH RISK: Consult a professional before proceeding')
        recommendations.append('Consider negotiating key terms or walking away')
    elif risk_score > 40:
        recommendations.append('⚠️ MODERATE RISK: Review carefully before accepting')
        recommendations.append('Seek clarification on unclear terms')
    else:
        recommendations.append('✅ LOW RISK: Document appears reasonable')
    
    # Type-specific recommendations
    if doc_type == 'legal_contract':
        recommendations.append('Have a lawyer review if financial stakes are high')
    elif doc_type == 'financial_report':
        recommendations.append('Verify numbers with source documents')
    elif doc_type == 'terms_of_service':
        recommendations.append('Pay attention to data privacy and cancellation terms')
    
    # Risk-specific recommendations
    for risk in risk_categories[:3]:  # Top 3 risks
        if risk['severity'] == 'red':
            recommendations.append(f'🔴 Address: {risk["description"]}')
    
    return recommendations[:5]  # Top 5 recommendations

def analyze_document(
    text: str,
    hint_type: Optional[str] = None
) -> AnalysisResult:
    """
    Universal document analyzer - works with ANY document type
    
    Args:
        text: Document text to analyze
        hint_type: Optional hint about document type
    
    Returns:
        Comprehensive analysis with findings, risks, and recommendations
    """
    if not text or len(text) < 10:
        raise ValueError("Text too short to analyze")
    
    # Detect document type
    if hint_type:
        doc_type, confidence = hint_type, 0.9
    else:
        doc_type, confidence = detect_document_type(text)
    
    # Extract entities
    entities = extract_entities(text)
    
    # Calculate sentiment
    sentiment = calculate_sentiment(text)
    
    # Calculate risk
    risk_score, risk_categories = calculate_risk_score(text, doc_type)
    
    # Generate summary
    summary = generate_summary(text, doc_type)
    
    # Key findings
    key_findings = []
    if entities:
        key_findings.append(f'Found {len(entities)} important entities (emails, dates, amounts)')
    if risk_score > 50:
        key_findings.append(f'Risk score: {risk_score}/100 - requires attention')
    if sentiment == 'negative':
        key_findings.append('Document tone is concerning - review carefully')
    key_findings.extend([f"{r['description']}" for r in risk_categories[:3]])
    
    # Generate recommendations
    recommendations = generate_recommendations(doc_type, risk_score, risk_categories, sentiment)
    
    # Metadata
    metadata = {
        'word_count': len(text.split()),
        'character_count': len(text),
        'analyzed_at': datetime.utcnow().isoformat(),
        'risk_categories': risk_categories,
        'entity_counts': {
            'total': len(entities),
            'by_type': {}
        }
    }
    
    for entity in entities:
        etype = entity['type']
        metadata['entity_counts']['by_type'][etype] = \
            metadata['entity_counts']['by_type'].get(etype, 0) + 1
    
    return AnalysisResult(
        document_type=doc_type,
        confidence=confidence,
        risk_score=risk_score,
        sentiment=sentiment,
        key_findings=key_findings[:10],
        summary=summary,
        recommendations=recommendations,
        entities=entities,
        metadata=metadata
    )

# For backward compatibility with existing code
def enhanced_legal_analysis(text: str) -> Dict:
    """Legacy function for legal document analysis"""
    result = analyze_document(text, hint_type='legal_contract')
    return result.dict()
