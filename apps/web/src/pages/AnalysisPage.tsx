import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import { FileUpload } from '../components/FileUpload'
import { RiskMeter } from '../components/RiskMeter'
import { ClauseCard } from '../components/ClauseCard'
import { Badge } from '../components/ui/Badge'
import { api } from '@/lib/api'
import { AnalysisT } from '@/lib/schemas'
import { FileText, Download, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export function AnalysisPage() {
  const [text, setText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisT | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!text.trim() && !selectedFile) {
      toast.error('Please provide text or upload a file to analyze')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let result: AnalysisT

      if (selectedFile) {
        result = await api.analyzeFile(selectedFile)
      } else {
        result = await api.analyze(text)
      }

      setAnalysis(result)
      toast.success('Analysis completed successfully')
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Analysis failed'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setText('') // Clear text when file is selected
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
  }

  const handleClear = () => {
    setText('')
    setSelectedFile(null)
    setAnalysis(null)
    setError(null)
  }

  const handleExportPDF = async () => {
    if (!analysis) return

    try {
      await api.exportPDF(analysis, `paipersum-analysis-${Date.now()}.pdf`)
      toast.success('PDF exported successfully')
    } catch (err: any) {
      toast.error('Failed to export PDF')
    }
  }

  const getRiskBadgeVariant = (score: number) => {
    if (score >= 75) return 'destructive'
    if (score >= 50) return 'warning'
    return 'success'
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-ink-900">Analyze Legal Document</h2>
          <p className="text-sm text-ink-600">
            Upload a file or paste text to get an AI-powered risk assessment
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <FileUpload
            onFileSelect={handleFileSelect}
            onRemove={handleFileRemove}
            selectedFile={selectedFile}
            loading={loading}
          />

          {/* Text Input */}
          <div className="relative">
            <Textarea
              label="Or paste text directly"
              placeholder="Paste your legal document text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading || !!selectedFile}
              className="min-h-[200px]"
            />
            {selectedFile && (
              <div className="absolute inset-0 bg-paper-50/80 flex items-center justify-center rounded-lg">
                <p className="text-sm text-ink-500">File selected - text input disabled</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAnalyze}
              loading={loading}
              disabled={(!text.trim() && !selectedFile) || loading}
              className="flex-1 sm:flex-none"
            >
              <FileText className="h-4 w-4 mr-2" />
              {loading ? 'Analyzing...' : 'Analyze Document'}
            </Button>
            <Button variant="secondary" onClick={handleClear} disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-brand-red/10 border border-brand-red/20 rounded-lg">
              <p className="text-sm text-brand-red">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysis && (
        <div className="space-y-6">
          {/* Risk Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink-900">Risk Assessment</h2>
                <div className="flex items-center gap-2">
                  <Badge variant={getRiskBadgeVariant(analysis.risk_score)}>
                    {analysis.risk_score}% Risk
                  </Badge>
                  <Button variant="secondary" size="sm" onClick={handleExportPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <RiskMeter score={analysis.risk_score} />
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-600">
                  Confidence: <span className="font-medium">{(analysis.confidence * 100).toFixed(0)}%</span>
                </span>
                <span className="text-ink-600">
                  Clauses Found: <span className="font-medium">{analysis.clauses.length}</span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Clauses */}
          {analysis.clauses.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-ink-900">Identified Clauses</h2>
                <p className="text-sm text-ink-600">
                  Review the legal clauses found in your document
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {analysis.clauses.map((clause, index) => (
                    <ClauseCard
                      key={index}
                      title={clause.title}
                      summary={clause.summary}
                      risk={clause.risk}
                      citation={clause.citation}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
                <div>
                  <h3 className="font-medium text-ink-900 mb-1">Important Legal Disclaimer</h3>
                  <p className="text-sm text-ink-600 leading-relaxed">
                    This analysis is generated by artificial intelligence and is for informational purposes only. 
                    It does not constitute legal advice, and you should consult with a qualified attorney for 
                    any legal decisions. PaiperSum is not a law firm and does not provide legal services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}