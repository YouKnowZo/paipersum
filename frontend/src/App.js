import React, { useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import EditFields from "./components/EditFields";
import Pricing from "./components/Pricing";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

export default function App() {
  const [file, setFile] = useState(null);
  const [fields, setFields] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:8000/api/scan-resume", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setFields(data.fields);
    setLoading(false);
  };

  const handleFieldChange = (key, value) => {
    setFields({ ...fields, [key]: value });
  };

  const handleRebuild = async () => {
    const formData = new FormData();
    Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
    const res = await fetch("http://localhost:8000/api/rebuild-resume", {
      method: "POST",
      body: formData,
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Reconstructed_Resume.pdf";
    a.click();
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col">
      <Header />
      <UploadSection onFileChange={handleFileChange} onUpload={handleUpload} loading={loading} />
      {fields && (
        <EditFields fields={fields} onFieldChange={handleFieldChange} onRebuild={handleRebuild} />
      )}
      <HowItWorks />
      <Pricing />
      <Footer />
    </div>
  );
}

export default function App() {
 return (
   <>
     <SpeedInsights />
     <div className="bg-slate-900 min-h-screen text-white flex flex-col">
       <Header />
       <UploadSection onFileChange={handleFileChange} onUpload={handleUpload} loading={loading} />
       {fields && (
         <EditFields fields={fields} onFieldChange={handleFieldChange} onRebuild={handleRebuild} />
       )}
       <HowItWorks />
       <Pricing />
       <Footer />
     </div>
   </>
 );
}