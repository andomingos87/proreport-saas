'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'

interface Column {
  key: string
  label: string
  sortable?: boolean
}

export interface TableProps {
  columns: Column[]
  data: any[]
  onSort?: (key: string) => void
  sortColumn?: string
  sortDirection?: 'asc' | 'desc'
  loading?: boolean
  onRowClick?: (row: any) => void
}

export function Table({ columns, data, onSort, sortColumn, sortDirection, loading, onRowClick }: TableProps) {
  const getSortIcon = (key: string) => {
    if (key !== sortColumn) return null
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No data to display
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                {column.sortable ? (
                  <button
                    onClick={() => onSort?.(column.key)}
                    className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {column.label}
                    {getSortIcon(column.key)}
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((item, index) => (
            <tr 
              key={index} 
              className={onRowClick ? "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors" : ""}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
              {columns.map(column => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 