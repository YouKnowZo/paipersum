import { useCallback, useState } from 'react'

interface UploadProps {
  onFileSelect: (file: File) => void
  loading?: boolean
}

export default function Upload({ onFileSelect, loading }: UploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }, [onFileSelect])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }, [onFileSelect])

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
        ${isDragging 
          ? 'border-brand-sky bg-brand-sky/5' 
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        }
        ${loading ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleChange}
        disabled={loading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="space-y-3">
        <div className={`
          w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-colors
          ${isDragging ? 'bg-brand-sky text-white' : 'bg-slate-100 text-slate-400'}
        `}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div>
          <p className="font-medium text-slate-700">
            {isDragging ? 'Drop file here' : 'Drag and drop a file'}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            or click to browse
          </p>
        </div>
        
        <p className="text-xs text-slate-400">
          Supports PDF, DOC, DOCX, TXT
        </p>
      </div>
    </div>
  )
}
