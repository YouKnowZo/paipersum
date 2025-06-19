import React from "react";
export default function UploadSection({ onFileChange, onUpload, loading }) {
  return (
    <section className="my-8 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-2">Upload Your Document</h2>
      <p className="mb-4 text-slate-300">PDF or DOCX. We'll scan, extract, and let you edit before rebuilding.</p>
      <form onSubmit={onUpload} className="flex flex-col items-center">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={onFileChange}
          className="mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded text-white"
          disabled={loading}
        >
          {loading ? "Scanning..." : "Scan & Extract"}
        </button>
      </form>
    </section>
  );
}