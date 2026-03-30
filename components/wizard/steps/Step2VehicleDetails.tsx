'use client'

export function Step2VehicleDetails({ data, onNext, onBack }: { data: any, onNext: (data: any) => void, onBack: () => void }) {
  return (
    <div className="p-6 sm:p-8">
      <h2 className="text-lg font-medium text-gray-900">Vehicle Details</h2>
      <p className="mt-1 text-sm text-gray-500">Enter the subject vehicle information.</p>
      
      <div className="mt-6 border rounded-xl p-12 text-center bg-gray-50">
        <p className="text-sm text-gray-500">Vehicle details form will go here.</p>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={() => onNext({})}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
