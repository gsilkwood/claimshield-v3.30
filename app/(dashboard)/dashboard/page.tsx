import Link from 'next/link'
import { FileText, PlusCircle, Clock, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back. Here's an overview of your appraisals.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/appraisals/new"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Appraisal
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stat Card 1 */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Completed Reports</dt>
                  <dd className="text-2xl font-semibold text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm"><Link href="/appraisals" className="font-medium text-blue-600 hover:text-blue-900">View all</Link></div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Saved Drafts</dt>
                  <dd className="text-2xl font-semibold text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm"><Link href="/drafts" className="font-medium text-blue-600 hover:text-blue-900">Resume work</Link></div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Plan Usage</dt>
                  <dd className="text-2xl font-semibold text-gray-900">Free Tier</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm"><Link href="/billing" className="font-medium text-blue-600 hover:text-blue-900">Upgrade plan</Link></div>
          </div>
        </div>
      </div>

      {/* Empty State for Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appraisals yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new diminished value appraisal report.</p>
          <div className="mt-6">
            <Link
              href="/appraisals/new"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <PlusCircle className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Appraisal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
