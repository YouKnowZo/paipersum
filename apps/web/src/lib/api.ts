import axios from 'axios'
import { EnhancedAnalysis, ThreatEvent, AdminDashboard, ConfigSettings, type EnhancedAnalysisT, type AdminDashboardT, type ThreatEventT, type ConfigSettingsT } from './schemas'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

let adminPortalKey: string | null = null

export function setAdminPortalKey(key: string | null) {
  adminPortalKey = key
}

function adminHeaders() {
  return adminPortalKey ? { 'X-Admin-Key': adminPortalKey } : {}
}

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

export async function fetchAdminDashboard(): Promise<AdminDashboardT> {
  try {
    const res = await axios.get(`${API_URL}/admin/dashboard`, {
      headers: {
        ...adminHeaders()
      }
    })
    const parsed = AdminDashboard.safeParse(res.data)
    if (!parsed.success) {
      throw new Error('Invalid admin dashboard response')
    }
    return parsed.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Admin dashboard unavailable')
    }
    throw error
  }
}

export async function acknowledgeThreat(eventId: string): Promise<ThreatEventT> {
  try {
    const res = await axios.post(`${API_URL}/threats/${eventId}/acknowledge`, undefined, {
      headers: {
        ...adminHeaders()
      }
    })
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

export async function updateAdminConfig(payload: Partial<ConfigSettingsT>): Promise<ConfigSettingsT> {
  try {
    const res = await axios.patch(`${API_URL}/admin/config`, payload, {
      headers: {
        ...adminHeaders()
      }
    })
    const parsed = ConfigSettings.safeParse(res.data)
    if (!parsed.success) {
      throw new Error('Invalid config response')
    }
    return parsed.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to update config')
    }
    throw error
  }
}
