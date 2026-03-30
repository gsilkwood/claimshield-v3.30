import { FileEdit } from 'lucide-react'

export default function DraftsPage() {
  return (
    <div className="p-6 sm:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Drafts</h1>
        <p className="mt-1 text-sm text-gray-500">Resume work on incomplete appraisals.</p>
      </div>

      <div className="mt-8">
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <FileEdit className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No saved drafts</h3>
          <p className="mt-1 text-sm text-gray-500">Your in-progress appraisals will appear here.</p>
        </div>
      </div>
    </div>
  )
}
