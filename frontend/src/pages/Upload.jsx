import React from "react";
import Button from "../components/Button";

const Upload = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-primary mb-4">Upload Documents</h1>
      <input type="file" className="w-full border p-2 rounded-md" />
      <Button className="mt-4">Upload</Button>
    </div>
  );
};

export default Upload;
