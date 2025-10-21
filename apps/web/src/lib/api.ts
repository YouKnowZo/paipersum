import axios, { AxiosInstance } from 'axios'
import { Analysis, LoginRequest, RegisterRequest, AuthResponse, Document } from './schemas'
import type { AnalysisT, LoginRequestT, RegisterRequestT, AuthResponseT, DocumentT } from './schemas'

class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  async analyze(text: string): Promise<AnalysisT> {
    const response = await this.client.post('/analyze', { text })
    const parsed = Analysis.safeParse(response.data)
    if (!parsed.success) {
      throw new Error('Invalid response format from server')
    }
    return parsed.data
  }

  async analyzeFile(file: File): Promise<AnalysisT> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await this.client.post('/analyze-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    const parsed = Analysis.safeParse(response.data)
    if (!parsed.success) {
      throw new Error('Invalid response format from server')
    }
    return parsed.data
  }

  async login(credentials: LoginRequestT): Promise<AuthResponseT> {
    const response = await this.client.post('/auth/login', credentials)
    const parsed = AuthResponse.safeParse(response.data)
    if (!parsed.success) {
      throw new Error('Invalid response format from server')
    }
    return parsed.data
  }

  async register(userData: RegisterRequestT): Promise<AuthResponseT> {
    const { confirmPassword, ...data } = userData
    const response = await this.client.post('/auth/register', data)
    const parsed = AuthResponse.safeParse(response.data)
    if (!parsed.success) {
      throw new Error('Invalid response format from server')
    }
    return parsed.data
  }

  async getDocuments(): Promise<DocumentT[]> {
    const response = await this.client.get('/documents')
    return response.data
  }

  async getDocument(id: string): Promise<DocumentT> {
    const response = await this.client.get(`/documents/${id}`)
    return response.data
  }

  async deleteDocument(id: string): Promise<void> {
    await this.client.delete(`/documents/${id}`)
  }

  async exportPDF(analysis: AnalysisT, filename: string = 'paipersum-report.pdf'): Promise<void> {
    const response = await this.client.post('/export/pdf', analysis, {
      responseType: 'blob',
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  async getMe(): Promise<any> {
    const response = await this.client.get('/me')
    return response.data
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const api = new ApiClient(API_URL)