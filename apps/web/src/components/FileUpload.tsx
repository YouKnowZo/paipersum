import React, { useCallback, useState } from 'react'
import { Card, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Upload, FileText, X } from 'lucide-react'
import { clsx } from 'clsx'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onRemove: () => void
  selectedFile: File | null
  loading?: boolean
  accept?: string
  maxSize?: number // in MB
}

export function FileUpload({ 
  onFileSelect, 
  onRemove, 
  selectedFile, 
  loading = false,
  accept = '.pdf,.doc,.docx,.txt',
  maxSize = 10
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError(null)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setError(null)
    
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [])

  const handleFile = useCallback((file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      setError(`File type not supported. Allowed types: ${accept}`)
      return
    }

    onFileSelect(file)
  }, [onFileSelect, maxSize, accept])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (selectedFile) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-brand-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-ink-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={clsx(
        'border-2 border-dashed transition-colors',
        dragActive ? 'border-brand-blue bg-brand-blue/5' : 'border-border-200',
        error && 'border-brand-red'
      )}
    >
      <CardContent className="p-8">
        <div
          className="flex flex-col items-center justify-center space-y-4"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex-shrink-0">
            <Upload className="h-12 w-12 text-ink-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-ink-900">
              Drop your legal document here
            </p>
            <p className="text-xs text-ink-500 mt-1">
              or click to browse files
            </p>
            <p className="text-xs text-ink-400 mt-2">
              Supports PDF, DOC, DOCX, TXT (max {maxSize}MB)
            </p>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={loading}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={loading}
          >
            Choose File
          </Button>
          {error && (
            <p className="text-sm text-brand-red">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}