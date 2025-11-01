import axios from 'axios'
import { EnhancedAnalysis, type EnhancedAnalysisT } from './schemas'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function analyzeText(text: string, docType: string = 'general'): Promise<EnhancedAnalysisT> {
  try {
    const res = await axios.post(`${API_URL}/analyze`, { text, doc_type: docType })
    const parsed = EnhancedAnalysis.safeParse(res.data)
    
    if (!parsed.success) {
      console.error('Invalid response shape:', parsed.error)
      throw new Error('Invalid response from server')
    }
    
    return parsed.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'Request failed')
    }
    throw error
  }
}

export async function analyzeFile(file: File): Promise<EnhancedAnalysisT> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await axios.post(`${API_URL}/analyze-file`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    const parsed = EnhancedAnalysis.safeParse(res.data)
    
    if (!parsed.success) {
      console.error('Invalid response shape:', parsed.error)
      throw new Error('Invalid response from server')
    }
    
    return parsed.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'File upload failed')
    }
    throw error
  }
}

export async function exportPDF(text: string): Promise<Blob> {
  try {
    const res = await axios.post(`${API_URL}/export/pdf`, 
      { text }, 
      { responseType: 'blob' }
    )
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('PDF export failed')
    }
    throw error
  }
}

// New universal summarization APIs
export interface SummarizeRequest {
  query?: string
  style?: string
  mode?: 'universal' | 'legal'
  document_type?: string
}

export interface SummarizeResponse {
  summary: string
  mode: string
  style: string
  sources_count: number
  chunks_processed: number
}

export interface SummaryStyle {
  id: string
  description: string
}

export async function uploadForSummarization(file: File, mode: 'universal' | 'legal' = 'universal'): Promise<{ status: string; chunks_added: number; text_length: number }> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('mode', mode)
    
    const res = await axios.post(`${API_URL}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'Upload failed')
    }
    throw error
  }
}

export async function summarize(request: SummarizeRequest): Promise<SummarizeResponse> {
  try {
    const res = await axios.post(`${API_URL}/api/summarize`, request)
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'Summarization failed')
    }
    throw error
  }
}

export async function summarizeFile(
  file: File,
  options: {
    mode?: 'universal' | 'legal'
    style?: string
    query?: string
    document_type?: string
  } = {}
): Promise<SummarizeResponse> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('mode', options.mode || 'universal')
    formData.append('style', options.style || 'concise')
    if (options.query) formData.append('query', options.query)
    if (options.document_type) formData.append('document_type', options.document_type)
    
    const res = await axios.post(`${API_URL}/api/summarize-file`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'File summarization failed')
    }
    throw error
  }
}

export async function getSummaryStyles(mode: 'universal' | 'legal' = 'universal'): Promise<{ mode: string; styles: SummaryStyle[] }> {
  try {
    const res = await axios.get(`${API_URL}/api/summarize/styles`, {
      params: { mode }
    })
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch styles')
    }
    throw error
  }
}

export async function clearSummarizationIndex(): Promise<void> {
  try {
    await axios.post(`${API_URL}/api/clear`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to clear index')
    }
    throw error
  }
}
