import axios from 'axios'
import { EnhancedAnalysis, type EnhancedAnalysisT } from './schemas'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const withAuth = (token?: string) => (token ? { Authorization: `Bearer ${token}` } : {})

export async function analyzeText(text: string, docType: string = 'general', token?: string): Promise<EnhancedAnalysisT> {
  try {
    const res = await axios.post(
      `${API_URL}/analyze`,
      { text, doc_type: docType },
      { headers: { ...withAuth(token) } }
    )
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

export async function analyzeFile(file: File, token?: string): Promise<EnhancedAnalysisT> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await axios.post(`${API_URL}/analyze-file`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        ...withAuth(token)
      }
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

export async function exportPDF(text: string, token?: string): Promise<Blob> {
  try {
    const res = await axios.post(`${API_URL}/export/pdf`, 
      { text }, 
      { 
        responseType: 'blob',
        headers: { ...withAuth(token) }
      }
    )
    return res.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('PDF export failed')
    }
    throw error
  }
}
