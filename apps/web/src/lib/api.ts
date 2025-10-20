import axios from 'axios'
import { Analysis, type AnalysisT } from './schemas'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function analyzeText(text: string): Promise<AnalysisT> {
  try {
    const res = await axios.post(`${API_URL}/analyze`, { text })
    const parsed = Analysis.safeParse(res.data)
    
    if (!parsed.success) {
      console.error('Invalid response shape:', parsed.error)
      throw new Error('Invalid response from server')
    }
    
    return parsed.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.message || 'Request failed')
    }
    throw error
  }
}

export async function analyzeFile(file: File): Promise<AnalysisT> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await axios.post(`${API_URL}/analyze-file`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    const parsed = Analysis.safeParse(res.data)
    
    if (!parsed.success) {
      console.error('Invalid response shape:', parsed.error)
      throw new Error('Invalid response from server')
    }
    
    return parsed.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.message || 'File upload failed')
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
