import axios from 'axios'
import {
  EnhancedAnalysis,
  type EnhancedAnalysisT,
  PipelineDocument,
  type PipelineDocumentT,
  PipelineIngestResponse,
  type PipelineIngestResponseT,
  PipelineSummaryResponse,
  type PipelineSummaryResponseT
} from './schemas'

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

export async function pipelineUpload(file: File, mode: string = 'universal'): Promise<PipelineIngestResponseT> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('mode', mode)

  try {
    const res = await axios.post(`${API_URL}/pipeline/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    const parsed = PipelineIngestResponse.safeParse(res.data)
    if (!parsed.success) {
      throw new Error('Invalid pipeline upload response')
    }
    return parsed.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'Pipeline upload failed')
    }
    throw error
  }
}

interface PipelineSummarizeOptions {
  query: string
  mode?: string
  style?: string
  instructions?: string
  document_id?: string
  max_sources?: number
}

export async function pipelineSummarize(options: PipelineSummarizeOptions): Promise<PipelineSummaryResponseT> {
  try {
    const res = await axios.post(`${API_URL}/pipeline/summarize`, {
      query: options.query,
      mode: options.mode || 'universal',
      style: options.style || 'concise',
      instructions: options.instructions,
      document_id: options.document_id,
      max_sources: options.max_sources || 5
    })

    const parsed = PipelineSummaryResponse.safeParse(res.data)
    if (!parsed.success) {
      throw new Error('Invalid pipeline summary response')
    }
    return parsed.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'Pipeline summarization failed')
    }
    throw error
  }
}

export async function pipelineDocuments(): Promise<PipelineDocumentT[]> {
  try {
    const res = await axios.get(`${API_URL}/pipeline/documents`)
    const parsed = PipelineDocument.array().safeParse(res.data)
    if (!parsed.success) {
      throw new Error('Invalid pipeline documents response')
    }
    return parsed.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to load documents')
    }
    throw error
  }
}

export async function pipelineReset(): Promise<void> {
  try {
    await axios.post(`${API_URL}/pipeline/reset`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to reset pipeline')
    }
    throw error
  }
}
