'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentDropzoneProps {
  appraisalId: string
  onUploadComplete: (url: string) => void
  accept?: Record<string, string[]>
  label?: string
  type: 'repair_estimate' | 'photo' | 'insurance_card'
}

export function DocumentDropzone({ appraisalId, onUploadComplete, accept, label, type }: DocumentDropzoneProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'uploaded' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setStatus('uploading')
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    formData.append('appraisalId', appraisalId)

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      const { url } = await res.json()
      setStatus('uploaded')
      onUploadComplete(url)
    } catch (err) {
      console.error(err)
      setStatus('error')
      setError('Failed to upload document. Please try again.')
    }
  }, [appraisalId, onUploadComplete, type])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: accept || {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.heic'],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024, // 20MB
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all cursor-pointer',
          isDragActive && !isDragReject ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50',
          isDragReject ? 'border-red-500 bg-red-50' : '',
          status === 'uploading' ? 'pointer-events-none opacity-60' : ''
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center text-center">
          {status === 'idle' && (
            <>
              <div className="mb-4 rounded-full bg-blue-50 p-3">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">{label || 'Click to upload or drag and drop'}</p>
              <p className="mt-1 text-xs text-gray-500">PDF, PNG, JPG, HEIC up to 20MB</p>
            </>
          )}

          {status === 'uploading' && (
            <>
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-gray-900">Uploading document...</p>
              <p className="mt-1 text-xs text-gray-500">This will only take a moment.</p>
            </>
          )}

          {status === 'uploaded' && (
            <>
              <div className="mb-4 rounded-full bg-green-50 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Document uploaded successfully</p>
              <p className="mt-1 text-xs text-gray-500">AI extraction has been triggered.</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-4 rounded-full bg-red-50 p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">{error}</p>
              <p className="mt-1 text-xs text-gray-500 text-blue-600 underline">Try again</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
