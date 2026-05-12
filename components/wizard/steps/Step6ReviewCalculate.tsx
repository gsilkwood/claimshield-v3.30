'use client'

import { useState, useEffect } from 'react'
import { runAppraisalCalculations } from '@/lib/actions/calculation.actions'
import { Loader2, CheckCircle, TrendingDown, ShieldCheck, Info, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export function Step6ReviewCalculate({ data, onNext, onBack, appraisalId }: { data: any, onNext: (data: any) => void, onBack: () => void, appraisalId: string }) {
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<any>(data.valuationResults || null)

  const handleCalculate = async () => {
    setIsCalculating(true)
    try {
      const res = await runAppraisalCalculations(appraisalId)
      setResult(res)
      toast.success('Calculation complete')
    } catch (err) {
      console.error('Calculation failed:', err)
      toast.error('Calculation failed. Please ensure you have enough comparables.')
    } finally {
      setIsCalculating(false)
    }
  }

  useEffect(() => {
    if (!result) {
      handleCalculate()
    }
  }, [appraisalId])

  return (
    <div className="p-6 sm:p-8">
      <h2 className="text-lg font-medium text-gray-900">Review & Calculate</h2>
      <p className="mt-1 text-sm text-gray-500">Review the final diminished value calculation based on the comparable sales method.</p>
      
      <div className="mt-8 space-y-8">
        {isCalculating ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Computing Diminished Value...</h3>
            <p className="mt-2 text-sm text-gray-500">Applying adjustments and calculating medians for a defensible valuation.</p>
          </div>
        ) : result ? (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pre-Accident FMV</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">${Math.round(result.preAccidentFMV).toLocaleString()}</p>
              <p className="mt-1 text-xs text-gray-500">Median of clean comparables</p>
            </div>
            
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Post-Repair ACV</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">${Math.round(result.postRepairACV).toLocaleString()}</p>
              <p className="mt-1 text-xs text-gray-500">Median of accident-history comps</p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Diminished Value</p>
                <TrendingDown className="h-4 w-4 text-blue-600" />
              </div>
              <p className="mt-2 text-3xl font-bold text-blue-900">${Math.round(result.diminishedValue).toLocaleString()}</p>
              <p className="mt-1 text-xs text-blue-700">{result.dvAsPercentOfPreValue.toFixed(1)}% of vehicle value</p>
            </div>

            <div className="md:col-span-3 rounded-xl border border-green-100 bg-green-50 p-6">
              <div className="flex items-start">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-green-600 mr-3" />
                <div>
                  <h4 className="text-sm font-semibold text-green-900">Defensible Valuation Range</h4>
                  <p className="mt-1 text-sm text-green-800">
                    Based on market distribution, the diminished value ranges from 
                    <span className="font-bold"> ${Math.round(result.confidenceRange.low).toLocaleString()} </span> 
                    to 
                    <span className="font-bold"> ${Math.round(result.confidenceRange.high).toLocaleString()}</span>.
                  </p>
                  <p className="mt-2 text-xs text-green-700">
                    This calculation uses the comparable sales method (median) and is resistant to market outliers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-red-900">Calculation failed</h3>
            <p className="mt-1 text-sm text-red-700">We couldn&apos;t compute the DV. Please ensure you have selected at least 3 comparables in each category.</p>
            <button
              onClick={handleCalculate}
              className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry Calculation
            </button>
          </div>
        )}
      </div>

      <div className="mt-12 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => onNext({})}
          disabled={!result}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          Continue to Appraiser Info
        </button>
      </div>
    </div>
  )
}
