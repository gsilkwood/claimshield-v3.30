'use client'

import { useState, useEffect } from 'react'
import { DocumentDropzone } from '@/components/upload/DocumentDropzone'
import { Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { getAppraisal } from '@/lib/actions/appraisal.actions'

export function Step1DocumentUpload({ data, onNext, appraisalId }: { data: any, onNext: (data: any) => void, appraisalId: string }) {
  const [isExtracting, setIsExtracting] = useState(false)
  const [hasExtractedData, setHasExtractedData] = useState(!!data.extractedRepairData)
  const [uploadUrl, setUploadUrl] = useState<string | null>(data.repairEstimateUrl || null)

  const handleUploadComplete = (url: string) => {
    setUploadUrl(url)
    setIsExtracting(true)
  }

  // Polling for extraction data
  useEffect(() => {
    if (!isExtracting || hasExtractedData) return

    const interval = setInterval(async () => {
      try {
        const appraisal = await getAppraisal(appraisalId)
        if (appraisal?.extractedRepairData) {
          setHasExtractedData(true)
          setIsExtracting(false)
          clearInterval(interval)
          // We don't call onNext here, we let the user review and then click Continue
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isExtracting, hasExtractedData, appraisalId])

  return (
    <div className="p-6 sm:p-8">
      <h2 className="text-lg font-medium text-gray-900">Upload Documents</h2>
      <p className="mt-1 text-sm text-gray-500">Upload the repair estimate and damage photos to begin the appraisal process.</p>
      
      <div className="mt-8 space-y-8">
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Repair Estimate</h3>
          {!uploadUrl ? (
            <DocumentDropzone 
              appraisalId={appraisalId} 
              type="repair_estimate" 
              onUploadComplete={handleUploadComplete}
              label="Upload Repair Estimate (PDF, PNG, JPG)"
            />
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Repair Estimate Uploaded</p>
                  <p className="text-xs text-blue-700 truncate max-w-xs">{uploadUrl}</p>
                </div>
              </div>
              <button 
                onClick={() => setUploadUrl(null)}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Replace
              </button>
            </div>
          )}
        </section>

        {isExtracting && (
          <div className="flex items-center justify-center rounded-xl border border-yellow-200 bg-yellow-50 p-6">
            <Loader2 className="h-5 w-5 animate-spin text-yellow-600 mr-3" />
            <p className="text-sm font-medium text-yellow-900">AI is extracting repair data... Please wait.</p>
          </div>
        )}

        {hasExtractedData && (
          <div className="flex items-center justify-center rounded-xl border border-green-200 bg-green-50 p-6">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <p className="text-sm font-medium text-green-900">AI extraction complete. Data is ready for review in the next steps.</p>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-end">
        <button
          onClick={() => onNext({})}
          disabled={!uploadUrl || isExtracting}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isExtracting ? 'Processing...' : 'Continue to Vehicle Details'}
        </button>
      </div>
    </div>
  )
}
