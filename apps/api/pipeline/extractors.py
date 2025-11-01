"""Document ingestion helpers for multiple file types."""

from __future__ import annotations

import io
import json
import tempfile
import uuid
from pathlib import Path

import fitz  # type: ignore
from bs4 import BeautifulSoup
from docx import Document  # type: ignore
from PIL import Image
import pytesseract


TEXT_EXTENSIONS = {
    ".txt",
    ".md",
    ".csv",
    ".log",
    ".json",
    ".yaml",
    ".yml",
}

IMAGE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".bmp",
    ".tiff",
    ".webp",
}


def _strip_control_chars(text: str) -> str:
    return "".join(ch for ch in text if (31 < ord(ch) < 127) or ch in "\n\r\t" or ch.isprintable())


def _load_pdf(path: Path) -> str:
    doc = fitz.open(path.as_posix())
    pages = [page.get_text("text") for page in doc]
    return "\n\n".join(pages)


def _load_docx(path: Path) -> str:
    document = Document(path.as_posix())
    paragraphs = [p.text.strip() for p in document.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)


def _load_html(path: Path) -> str:
    html = path.read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(html, "html.parser")
    for script in soup(["script", "style"]):
        script.decompose()
    return soup.get_text("\n")


def _load_markdown(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def _load_json(path: Path) -> str:
    try:
        data = json.loads(path.read_text(encoding="utf-8", errors="ignore"))
    except json.JSONDecodeError:
        return path.read_text(encoding="utf-8", errors="ignore")
    return json.dumps(data, indent=2, ensure_ascii=False)


def _ocr_image(path: Path) -> str:
    try:
        image = Image.open(path.as_posix())
        return pytesseract.image_to_string(image)
    except (pytesseract.TesseractNotFoundError, OSError) as err:
        print(f"OCR error: {err}")
        return ""


def extract_text(path: Path) -> str:
    """Return best-effort text from supported file types."""

    suffix = path.suffix.lower()

    if suffix == ".pdf":
        text = _load_pdf(path)
    elif suffix == ".docx":
        text = _load_docx(path)
    elif suffix in {".html", ".htm"}:
        text = _load_html(path)
    elif suffix in {".md", ".markdown"}:
        text = _load_markdown(path)
    elif suffix in {".json", ".jsonl"}:
        text = _load_json(path)
    elif suffix in IMAGE_EXTENSIONS:
        text = _ocr_image(path)
    elif suffix in TEXT_EXTENSIONS:
        text = path.read_text(encoding="utf-8", errors="ignore")
    else:
        text = path.read_text(encoding="utf-8", errors="ignore")

    if not text:
        return ""

    return _strip_control_chars(text)


def extract_text_from_bytes(filename: str, payload: bytes) -> str:
    """Persist payload to a temporary buffer and extract text."""

    suffix = Path(filename).suffix.lower()
    buffer = io.BytesIO(payload)

    if suffix in IMAGE_EXTENSIONS:
        image = Image.open(buffer)
        return pytesseract.image_to_string(image)

    safe_name = Path(filename).name or f"upload-{uuid.uuid4().hex}"
    with tempfile.NamedTemporaryFile(prefix="paipersum-", suffix=f"-{safe_name}", delete=False) as tmp:
        tmp.write(payload)
        temp_path = Path(tmp.name)

    try:
        return extract_text(temp_path)
    finally:
        temp_path.unlink(missing_ok=True)


