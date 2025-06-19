import React from "react";
export default function HowItWorks() {
  return (
    <section className="my-12 text-center">
      <h2 className="text-2xl font-bold mb-4">How It Works</h2>
      <div className="flex flex-wrap justify-center gap-8">
        <div className="w-64">
          <div className="text-4xl mb-2">📤</div>
          <h3 className="font-semibold mb-1">1. Upload</h3>
          <p>Upload your resume, contract, or T&C PDF/DOCX.</p>
        </div>
        <div className="w-64">
          <div className="text-4xl mb-2">🧠</div>
          <h3 className="font-semibold mb-1">2. AI Extraction</h3>
          <p>We scan, extract, and let you edit all fields and info.</p>
        </div>
        <div className="w-64">
          <div className="text-4xl mb-2">🎨</div>
          <h3 className="font-semibold mb-1">3. Rebuild & Download</h3>
          <p>Get a new, clean PDF in the same style—ready to use!</p>
        </div>
      </div>
    </section>
  );
}