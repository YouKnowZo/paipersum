import React, { useState } from "react";
import { uploadFile, extractText, fillForm } from "../js/api";

export default function DocumentAnalyzer() {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [inputs, setInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFilename("");
    setExtractedText("");
    setInputs({});
    setError("");
    setSuccess("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file.");
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await uploadFile(file);
      setFilename(res.filename || file.name);
      setSuccess("File uploaded. Extracting text...");
      const textRes = await extractText(res.filename || file.name);
      setExtractedText(textRes.extracted_text);
      setSuccess("Text extracted. You can now fill fields and generate PDF.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleFillForm = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fillForm(extractedText, inputs);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "completed_form.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setSuccess("PDF generated and downloaded!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Document Analyzer</h2>
      <form onSubmit={handleUpload} className="mb-4 flex flex-col items-center">
        <input type="file" accept=".pdf,.docx,.png,.jpg,.jpeg" onChange={handleFileChange} className="mb-2" />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Processing..." : "Upload & Extract"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {extractedText && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Extracted Text</h3>
          <textarea className="w-full border rounded p-2 mb-2" rows={6} value={extractedText} readOnly />
          <h4 className="font-semibold mb-1">Fill Fields (optional)</h4>
          <input name="[FULL_NAME]" placeholder="Full Name" className="w-full border rounded p-2 mb-2" onChange={handleInputChange} />
          <input name="[ADDRESS]" placeholder="Address" className="w-full border rounded p-2 mb-2" onChange={handleInputChange} />
          <input name="[PHONE]" placeholder="Phone Number" className="w-full border rounded p-2 mb-2" onChange={handleInputChange} />
          <button className="btn btn-secondary mt-2" onClick={handleFillForm} disabled={loading}>
            {loading ? "Generating PDF..." : "Generate PDF"}
          </button>
        </div>
      )}
    </div>
  );
}
