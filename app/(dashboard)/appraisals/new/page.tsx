import { redirect } from 'next/navigation'
import { createAppraisalDraft } from '@/lib/actions/appraisal.actions'

export const dynamic = 'force-dynamic'

export default async function NewAppraisalPage() {
  const result = await createAppraisalDraft()
  
  if (result.success) {
    redirect(`/appraisals/${result.data.id}`)
  }
  
  return (
    <div className="p-6 sm:p-8">
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Failed to create appraisal draft</h3>
        <p className="mt-2 text-sm text-red-700">Please try again later.</p>
      </div>
    </div>
  )
}
