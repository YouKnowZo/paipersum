// This file contains backend code and should not be in the frontend. Please move this file to the backend/routes directory if needed, or delete it from the frontend.
// If you need frontend API utilities, implement them using fetch or axios for browser use.
// Implements the missing scrapeAndAnalyze function for frontend use
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function scrapeAndAnalyze(url) {
    try {
        const response = await fetch(`${API_BASE_URL}/scrape`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) {
            throw new Error('Failed to analyze URL');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'Unknown error');
    }
}

export async function uploadFile(file, instructions = '') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('instructions', instructions);
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });
  if (!response.ok) throw new Error('Upload failed');
  return await response.json();
}

export async function extractText(filename) {
  const response = await fetch(`${API_BASE_URL}/extract-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename })
  });
  if (!response.ok) throw new Error('Text extraction failed');
  return await response.json();
}

export async function fillForm(extracted_text, inputs) {
  const response = await fetch(`${API_BASE_URL}/fill-form`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ extracted_text, inputs })
  });
  if (!response.ok) throw new Error('Form fill failed');
  // This returns a PDF file, so handle as blob if needed
  return response;
}