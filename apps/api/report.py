"""PDF report generation"""
from fpdf import FPDF
from typing import Dict, Any

def build_report(name: str, analysis: Dict[str, Any]) -> bytes:
    """Generate PDF report from analysis"""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Title
    pdf.set_font('Arial', 'B', 20)
    pdf.cell(0, 10, 'PaiperSum Analysis Report', ln=1, align='C')
    pdf.ln(5)
    
    # Document name
    pdf.set_font('Arial', 'I', 12)
    pdf.cell(0, 8, f'Document: {name}', ln=1)
    pdf.ln(3)
    
    # Risk summary
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 8, 'Risk Assessment', ln=1)
    pdf.set_font('Arial', '', 12)
    
    risk_score = analysis.get('risk_score', 0)
    confidence = analysis.get('confidence', 0)
    
    risk_label = 'High Risk' if risk_score >= 75 else 'Moderate Risk' if risk_score >= 50 else 'Low Risk' if risk_score >= 25 else 'Minimal Risk'
    
    pdf.cell(0, 7, f'Risk Score: {risk_score}/100 ({risk_label})', ln=1)
    pdf.cell(0, 7, f'Confidence: {int(confidence * 100)}%', ln=1)
    pdf.ln(5)
    
    # Clauses
    clauses = analysis.get('clauses', [])
    
    if clauses:
        pdf.set_font('Arial', 'B', 14)
        pdf.cell(0, 8, f'Key Clauses ({len(clauses)} found)', ln=1)
        pdf.ln(2)
        
        for i, clause in enumerate(clauses, 1):
            # Clause title
            pdf.set_font('Arial', 'B', 11)
            risk_indicator = '🔴' if clause['risk'] == 'red' else '🟡' if clause['risk'] == 'yellow' else '🟢'
            pdf.multi_cell(0, 6, f"{i}. {clause['title']} {risk_indicator}")
            
            # Clause summary
            pdf.set_font('Arial', '', 10)
            pdf.multi_cell(0, 5, f"   {clause['summary']}")
            
            # Citation
            pdf.set_font('Arial', 'I', 9)
            citation = clause.get('citation', '')[:200]  # Limit length
            pdf.multi_cell(0, 5, f'   Source: "{citation}"')
            pdf.ln(3)
    else:
        pdf.set_font('Arial', '', 11)
        pdf.cell(0, 7, 'No significant clauses detected.', ln=1)
    
    pdf.ln(10)
    
    # Disclaimer
    pdf.set_font('Arial', 'B', 10)
    pdf.cell(0, 6, 'LEGAL DISCLAIMER', ln=1)
    pdf.set_font('Arial', '', 8)
    pdf.multi_cell(0, 4, 
        'This report provides automated analysis for informational purposes only and does not '
        'constitute legal advice. Automated analysis may miss important clauses or misinterpret '
        'legal language. Always consult a licensed attorney for legal decisions.'
    )
    
    # Get PDF bytes
    pdf_bytes = pdf.output(dest='S')
    
    # fpdf returns string in Python 2 style, need to encode
    if isinstance(pdf_bytes, str):
        return pdf_bytes.encode('latin1')
    return bytes(pdf_bytes)
