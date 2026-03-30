import { getAppraisal } from '@/lib/actions/appraisal.actions'
import { WizardShell } from '@/components/wizard/WizardShell'
import { notFound } from 'next/navigation'

export default async function AppraisalWizardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const appraisal = await getAppraisal(id)
  
  if (!appraisal) {
    notFound()
  }
  
  return (
    <div className="p-6 sm:p-8">
      <WizardShell appraisalId={id} initialData={appraisal} />
    </div>
  )
}
