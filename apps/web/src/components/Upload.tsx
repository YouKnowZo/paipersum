import { useState, useCallback } from 'react'

interface UploadProps {
  onFileSelect: (file: File) => void
  loading?: boolean
}

export default function Upload({ onFileSelect, loading = false }: UploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }, [onFileSelect])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-xl p-8
        transition-all duration-200
        ${dragActive 
          ? 'border-brand-blue bg-brand-blue/5' 
          : 'border-border-200 hover:border-brand-blue/50'
        }
        ${loading ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleChange}
        accept=".pdf,.doc,.docx,.txt"
        disabled={loading}
      />
      
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        <svg
          className="w-12 h-12 text-ink-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        
        <p className="text-sm font-medium text-ink-700 mb-1">
          {loading ? 'Processing...' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-ink-500">
          PDF, DOC, DOCX, or TXT (max 10MB)
        </p>
      </label>
    </div>
  )
}
