'use client'

import { useState, useEffect } from 'react'
import { triggerReportGeneration, getReportUrl } from '@/lib/actions/report.actions'
import { Loader2, FileText, Download, CheckCircle, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export function Step8GenerateReport({ data, onBack, appraisalId }: { data: any, onBack: () => void, appraisalId: string }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportUrl, setReportUrl] = useState<string | null>(data.reportPdfUrl || null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const url = await triggerReportGeneration(appraisalId)
      setReportUrl(url)
      toast.success('Report generated successfully')
    } catch (err) {
      console.error('Generation failed:', err)
      toast.error('Failed to generate report. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (data.reportPdfUrl) {
      setReportUrl(data.reportPdfUrl)
    }
  }, [data.reportPdfUrl])

  return (
    <div className="p-6 sm:p-8">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-gray-900">Generate Appraisal Report</h2>
        <p className="mt-1 text-sm text-gray-500">Your appraisal is complete. You can now generate the professional 15-25 page PDF report.</p>
      </div>

      <div className="mt-10">
        {isGenerating ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-12 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
            <h3 className="mt-4 text-lg font-medium text-blue-900">Assembling your report...</h3>
            <p className="mt-2 text-sm text-blue-700">We are generating charts, applying legal citations, and building your professional appraisal document.</p>
            <div className="mt-6 space-y-2 text-left max-w-xs mx-auto">
              <div className="flex items-center text-xs text-blue-600">
                <CheckCircle className="mr-2 h-3 w-3" />
                <span>Valuation charts generated</span>
              </div>
              <div className="flex items-center text-xs text-blue-600">
                <CheckCircle className="mr-2 h-3 w-3" />
                <span>Georgia legal citations applied</span>
              </div>
              <div className="flex items-center text-xs text-blue-600">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                <span>Finalizing PDF layout...</span>
              </div>
            </div>
          </div>
        ) : reportUrl ? (
          <div className="rounded-xl border border-green-100 bg-green-50 p-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <h3 className="mt-4 text-lg font-medium text-green-900">Report Ready!</h3>
            <p className="mt-2 text-sm text-green-700">Your professional diminished value appraisal has been generated and is ready for download.</p>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full sm:w-auto items-center justify-center rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-green-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF Report
              </a>
              <a
                href={reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full sm:w-auto items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View in Browser
              </a>
            </div>

            <div className="mt-8 rounded-lg bg-white p-4 text-left border border-green-200">
              <div className="flex items-start">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-xs font-medium text-green-900 uppercase">Professional Guarantee</p>
                  <p className="mt-1 text-xs text-green-700">
                    This report is USPAP-compliant and includes all necessary Georgia legal citations to be accepted by insurance companies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <ShieldCheck className="mx-auto h-12 w-12 text-blue-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Ready to Finalize</h3>
            <p className="mt-2 text-sm text-gray-500">Click the button below to generate your official diminished value report.</p>
            <button
              onClick={handleGenerate}
              className="mt-8 rounded-md bg-blue-600 px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Generate Official Report
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-start">
        <button
          onClick={onBack}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Back to Appraiser Info
        </button>
      </div>
    </div>
  )
}
