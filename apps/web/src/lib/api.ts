import axios from 'axios'
import { EnhancedAnalysis, ThreatDashboard, ThreatEvent, type EnhancedAnalysisT, type ThreatDashboardT, type ThreatEventT } from './schemas'

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

export async function fetchThreatFeed(): Promise<ThreatDashboardT> {
  try {
    const res = await axios.get(`${API_URL}/threat-feed`)
    const parsed = ThreatDashboard.safeParse(res.data)
    if (!parsed.success) {
      throw new Error('Invalid threat feed response')
    }
    return parsed.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Threat feed unavailable')
    }
    throw error
  }
}

export async function acknowledgeThreat(eventId: string): Promise<ThreatEventT> {
  try {
    const res = await axios.post(`${API_URL}/threats/${eventId}/acknowledge`)
    const parsed = ThreatEvent.safeParse(res.data)
    if (!parsed.success) {
      throw new Error('Invalid acknowledgment response')
    }
    return parsed.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to acknowledge threat')
    }
    throw error
  }
}
