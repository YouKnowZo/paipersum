import React from "react";
export default function EditFields({ fields, onFieldChange, onRebuild }) {
  return (
    <section className="bg-slate-800 p-6 rounded shadow max-w-lg w-full mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Edit Extracted Fields</h2>
      {Object.entries(fields).map(([key, value]) => (
        <div key={key} className="mb-3">
          <label className="block mb-1">{key}</label>
          <input
            className="w-full p-2 rounded bg-slate-700 text-white"
            value={value}
            onChange={e => onFieldChange(key, e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={onRebuild}
        className="bg-green-600 px-4 py-2 rounded mt-4"
      >
        Rebuild & Download PDF
      </button>
    </section>
  );
}