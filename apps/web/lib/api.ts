import { env } from "@/lib/env";
import { EnhancedAnalysis, type EnhancedAnalysisT } from "@/lib/schemas";

const API_URL = env.ANALYSIS_API_URL;

export async function analyzeText(text: string, docType: string = "general"): Promise<EnhancedAnalysisT> {
  try {
    const res = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, doc_type: docType }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(error.detail || "Request failed");
    }

    const data = await res.json();
    const parsed = EnhancedAnalysis.safeParse(data);

    if (!parsed.success) {
      console.error("Invalid response shape:", parsed.error);
      throw new Error("Invalid response from server");
    }

    return parsed.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Analysis failed");
  }
}

export async function analyzeFile(file: File): Promise<EnhancedAnalysisT> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/analyze-file`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "File upload failed" }));
      throw new Error(error.detail || "File upload failed");
    }

    const data = await res.json();
    const parsed = EnhancedAnalysis.safeParse(data);

    if (!parsed.success) {
      console.error("Invalid response shape:", parsed.error);
      throw new Error("Invalid response from server");
    }

    return parsed.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("File analysis failed");
  }
}

export async function exportPDF(text: string): Promise<Blob> {
  try {
    const res = await fetch(`${API_URL}/export/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error("PDF export failed");
    }

    return await res.blob();
  } catch (error) {
    throw new Error("PDF export failed");
  }
}
