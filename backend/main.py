from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import io
import pdfplumber
from docx import Document
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import tempfile

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_pdf_fields(file_bytes):
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    fields = {}
    for line in lines:
        if "name" in line.lower():
            fields["Name"] = line
        elif "email" in line.lower():
            fields["Email"] = line
        elif "phone" in line.lower():
            fields["Phone"] = line
        elif "summary" in line.lower():
            fields["Summary"] = line
    if not fields and lines:
        fields["Body"] = "\n".join(lines)
    return fields, {"font": "Helvetica", "size": 12}

def extract_docx_fields(file_bytes):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
        tmp.write(file_bytes)
        tmp.flush()
        doc = Document(tmp.name)
        lines = [p.text for p in doc.paragraphs if p.text.strip()]
    fields = {}
    for line in lines:
        if "name" in line.lower():
            fields["Name"] = line
        elif "email" in line.lower():
            fields["Email"] = line
        elif "phone" in line.lower():
            fields["Phone"] = line
        elif "summary" in line.lower():
            fields["Summary"] = line
    if not fields and lines:
        fields["Body"] = "\n".join(lines)
    return fields, {"font": "Times-Roman", "size": 12}

@app.post("/api/scan-resume")
async def scan_resume(file: UploadFile):
    content = await file.read()
    if file.filename.lower().endswith(".pdf"):
        fields, style = extract_pdf_fields(content)
    elif file.filename.lower().endswith(".docx"):
        fields, style = extract_docx_fields(content)
    else:
        return JSONResponse({"error": "Unsupported file type"}, status_code=400)
    return {"fields": fields, "style": style, "message": "Fields extracted. Edit and rebuild as needed."}

@app.post("/api/rebuild-resume")
async def rebuild_resume(
    Name: str = Form(None),
    Email: str = Form(None),
    Phone: str = Form(None),
    Summary: str = Form(None),
    Body: str = Form(None),
    style: str = Form("{}")
):
    # For demo: just create a simple PDF with the fields
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    y = 750
    c.setFont("Helvetica-Bold", 18)
    if Name:
        c.drawString(72, y, Name)
        y -= 30
    c.setFont("Helvetica", 12)
    if Email:
        c.drawString(72, y, f"Email: {Email}")
        y -= 20
    if Phone:
        c.drawString(72, y, f"Phone: {Phone}")
        y -= 20
    if Summary:
        c.drawString(72, y, f"Summary: {Summary}")
        y -= 30
    if Body:
        for line in Body.splitlines():
            c.drawString(72, y, line)
            y -= 15
    c.showPage()
    c.save()
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=Reconstructed_Resume.pdf"})