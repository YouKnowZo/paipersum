import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { RiskMeter } from '../components/RiskMeter'
import { api } from '@/lib/api'
import { DocumentT } from '@/lib/schemas'
import { FileText, Download, Trash2, Calendar, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentT[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const docs = await api.getDocuments()
      setDocuments(docs)
    } catch (err: any) {
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      await api.deleteDocument(id)
      setDocuments(docs => docs.filter(doc => doc.id !== id))
      toast.success('Document deleted successfully')
    } catch (err: any) {
      toast.error('Failed to delete document')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-paper-100 rounded animate-pulse"></div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-paper-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Documents</h1>
          <p className="text-ink-600">Manage your analyzed legal documents</p>
        </div>
        <Button onClick={() => window.location.href = '/'}>
          <FileText className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-ink-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-ink-900 mb-2">No documents yet</h3>
            <p className="text-ink-600 mb-6">
              Upload and analyze your first legal document to get started
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Start Analyzing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="h-5 w-5 text-brand-blue flex-shrink-0" />
                      <h3 className="font-semibold text-ink-900 truncate">
                        {doc.name}
                      </h3>
                      <Badge variant="default">
                        {doc.mime_type.split('/')[1].toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-ink-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(doc.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatFileSize(doc.size)}
                      </div>
                    </div>

                    {doc.analysis && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-ink-700">Risk Assessment</span>
                          <Badge variant={
                            doc.analysis.risk_score >= 75 ? 'destructive' :
                            doc.analysis.risk_score >= 50 ? 'warning' : 'success'
                          }>
                            {doc.analysis.risk_score}% Risk
                          </Badge>
                        </div>
                        <RiskMeter score={doc.analysis.risk_score} showLabel={false} size="sm" />
                        <div className="text-xs text-ink-500">
                          Confidence: {(doc.analysis.confidence * 100).toFixed(0)}% • 
                          Clauses: {doc.analysis.clauses.length}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {doc.analysis && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => api.exportPDF(doc.analysis!, `${doc.name}-analysis.pdf`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}