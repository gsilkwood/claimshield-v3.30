'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { FileText, PlusCircle } from 'lucide-react'

type AppraisalSummary = {
  id: string
  date: string
  claimNumber: string
  vehicle: string
  status: 'complete' | 'sent' | 'settled' | 'denied'
  dvAmount: number
}

const columnHelper = createColumnHelper<AppraisalSummary>()

const columns = [
  columnHelper.accessor('date', {
    header: 'Date',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('claimNumber', {
    header: 'Claim #',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('vehicle', {
    header: 'Vehicle',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: info => (
      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('dvAmount', {
    header: 'DV Amount',
    cell: info => <span className="font-mono">${info.getValue().toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>,
  }),
]

export default function AppraisalsPage() {
  // Empty state for now
  const [data] = useState<AppraisalSummary[]>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-6 sm:p-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appraisals</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage your completed diminished value reports.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/appraisals/new"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Appraisal
          </Link>
        </div>
      </div>

      <div className="mt-8 flow-root">
        {data.length > 0 ? (
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th key={header.id} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {table.getRowModel().rows.map(row => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No completed appraisals</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't generated any reports yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
