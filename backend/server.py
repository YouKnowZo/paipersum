from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
import pytesseract
from PIL import Image
import os
import cv2
from fpdf import FPDF

app = Flask(__name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Set the path to tesseract if needed (Windows default)
pytesseract.pytesseract.tesseract_cmd = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'

@app.route('/')
def home():
    return "PaiperSum Backend Running"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)

    image = Image.open(filepath)
    extracted_text = pytesseract.image_to_string(image)

    user_input = request.form.get("instructions", "").lower()
    # This is a placeholder logic, we'll improve it next
    if "name is" in user_input:
        name = user_input.split("name is")[-1].split(",")[0].strip()
        extracted_text += f"\n\n[Filled Name]: {name}"

    return jsonify({"extracted": extracted_text})

@app.route('/extract-text', methods=['POST'])
def extract_text():
    data = request.json
    filename = data.get('filename')
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    try:
        # Try to open as image first
        try:
            image = cv2.imread(filepath)
            if image is None:
                raise Exception('Not an image file')
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            text = pytesseract.image_to_string(gray)
        except Exception:
            # If not image, try PDF (extract first page as image)
            from pdf2image import convert_from_path
            pages = convert_from_path(filepath, 500)
            if not pages:
                raise Exception('No pages found in PDF')
            temp_img_path = filepath + '_page1.png'
            pages[0].save(temp_img_path, 'PNG')
            image = cv2.imread(temp_img_path)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            text = pytesseract.image_to_string(gray)
            os.remove(temp_img_path)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    return jsonify({'extracted_text': text})

@app.route('/fill-form', methods=['POST'])
def fill_form():
    data = request.json
    extracted_text = data.get('extracted_text', '')
    user_inputs = data.get('inputs', {})  # Dictionary: {field_name: value}
    final_text = extracted_text
    for key, value in user_inputs.items():
        final_text = final_text.replace(key, value)
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(190, 10, final_text)
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], 'filled_form.pdf')
    pdf.output(output_path)
    return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)