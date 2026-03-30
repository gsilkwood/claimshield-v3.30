'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WizardProgress } from './WizardProgress'
import { Step1DocumentUpload } from './steps/Step1DocumentUpload'
import { Step2VehicleDetails } from './steps/Step2VehicleDetails'
import { Step3AccidentDetails } from './steps/Step3AccidentDetails'
import { Step4PreAccidentComps } from './steps/Step4PreAccidentComps'
import { Step5PostAccidentComps } from './steps/Step5PostAccidentComps'
import { Step6ReviewCalculate } from './steps/Step6ReviewCalculate'
import { Step7AppraiserInfo } from './steps/Step7AppraiserInfo'
import { Step8GenerateReport } from './steps/Step8GenerateReport'
import { saveAppraisalDraft } from '@/lib/actions/appraisal.actions'
import { toast } from 'sonner'

const STEPS = [
  { id: 1, name: 'Upload Documents' },
  { id: 2, name: 'Vehicle Details' },
  { id: 3, name: 'Accident Details' },
  { id: 4, name: 'Pre-Accident Comps' },
  { id: 5, name: 'Post-Accident Comps' },
  { id: 6, name: 'Review & Calculate' },
  { id: 7, name: 'Appraiser Info' },
  { id: 8, name: 'Generate Report' },
]

export function WizardShell({ appraisalId, initialData }: { appraisalId: string, initialData: any }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState(initialData || {})
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleNext = async (stepData: any) => {
    const newData = { ...data, ...stepData }
    setData(newData)
    
    setIsSaving(true)
    const result = await saveAppraisalDraft(appraisalId, stepData)
    setIsSaving(false)
    
    if (result.success) {
      if (currentStep < STEPS.length) {
        setCurrentStep(s => s + 1)
        window.scrollTo(0, 0)
      }
    } else {
      toast.error('Failed to save draft')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    const result = await saveAppraisalDraft(appraisalId, data)
    setIsSaving(false)
    if (result.success) {
      toast.success('Draft saved successfully')
      router.push('/drafts')
    } else {
      toast.error('Failed to save draft')
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Appraisal Wizard</h1>
        <button
          onClick={handleSaveDraft}
          disabled={isSaving}
          className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save & Exit'}
        </button>
      </div>

      <WizardProgress steps={STEPS} currentStep={currentStep} />

      <div className="mt-8 rounded-xl border bg-white shadow-sm">
        {currentStep === 1 && <Step1DocumentUpload data={data} onNext={handleNext} appraisalId={appraisalId} />}
        {currentStep === 2 && <Step2VehicleDetails data={data} onNext={handleNext} onBack={handleBack} />}
        {currentStep === 3 && <Step3AccidentDetails data={data} onNext={handleNext} onBack={handleBack} />}
        {currentStep === 4 && <Step4PreAccidentComps data={data} onNext={handleNext} onBack={handleBack} appraisalId={appraisalId} />}
        {currentStep === 5 && <Step5PostAccidentComps data={data} onNext={handleNext} onBack={handleBack} appraisalId={appraisalId} />}
        {currentStep === 6 && <Step6ReviewCalculate data={data} onNext={handleNext} onBack={handleBack} appraisalId={appraisalId} />}
        {currentStep === 7 && <Step7AppraiserInfo data={data} onNext={handleNext} onBack={handleBack} />}
        {currentStep === 8 && <Step8GenerateReport data={data} onBack={handleBack} appraisalId={appraisalId} />}
      </div>
    </div>
  )
}
