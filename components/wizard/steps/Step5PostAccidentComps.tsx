'use client'

import { useState, useEffect } from 'react'
import { triggerComparableSearch, getComparables, toggleComparableInclusion } from '@/lib/actions/comparable.actions'
import { Loader2, CheckCircle, AlertCircle, Search, Info } from 'lucide-react'
import { toast } from 'sonner'

export function Step5PostAccidentComps({ data, onNext, onBack, appraisalId }: { data: any, onNext: (data: any) => void, onBack: () => void, appraisalId: string }) {
  const [isSearching, setIsSearching] = useState(false)
  const [comps, setComps] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const fetchComps = async () => {
    try {
      const results = await getComparables(appraisalId)
      const accidentComps = results.filter(c => c.compType === 'post_accident')
      setComps(accidentComps)
      if (accidentComps.length > 0) setHasSearched(true)
    } catch (err) {
      console.error('Failed to fetch comps:', err)
    }
  }

  useEffect(() => {
    fetchComps()
  }, [appraisalId])

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      await triggerComparableSearch(appraisalId, 'post_accident')
      await fetchComps()
      toast.success('Search complete')
    } catch (err) {
      console.error('Search failed:', err)
      toast.error('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleToggle = async (id: string, included: boolean) => {
    try {
      await toggleComparableInclusion(id, included)
      setComps(prev => prev.map(c => c.id === id ? { ...c, includedInCalculation: included } : c))
    } catch (err) {
      console.error('Toggle failed:', err)
      toast.error('Failed to update comparable')
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Post-Accident Comparables</h2>
          <p className="mt-1 text-sm text-gray-500">Review accident-history comparable vehicles to establish the Post-Repair Actual Cash Value (ACV).</p>
        </div>
        {!hasSearched && (
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
            Automated Search
          </button>
        )}
      </div>

      <div className="mt-8">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Searching for comparables...</h3>
            <p className="mt-2 text-sm text-gray-500">We are scanning for vehicles with reported accident histories to establish market stigma impact.</p>
          </div>
        ) : comps.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Mileage</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Location</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Include</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {comps.map((comp) => (
                  <tr key={comp.id} className={comp.includedInCalculation ? '' : 'bg-gray-50 opacity-60'}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{comp.year} {comp.make} {comp.model}</div>
                      <div className="text-xs text-gray-500">{comp.trim}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{comp.mileage.toLocaleString()} mi</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${Number(comp.listingPrice).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{comp.locationCity}, {comp.locationState}</td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={comp.includedInCalculation}
                        onChange={(e) => handleToggle(comp.id, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <Info className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No comparables found</h3>
            <p className="mt-1 text-sm text-gray-500">Click the search button above to find accident-history vehicles.</p>
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
          disabled={comps.filter(c => c.includedInCalculation).length < 3}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          Continue to Review & Calculate
        </button>
      </div>
      {comps.filter(c => c.includedInCalculation).length < 3 && hasSearched && (
        <p className="mt-2 text-right text-xs text-red-600">Minimum 3 comparables required to proceed.</p>
      )}
    </div>
  )
}
