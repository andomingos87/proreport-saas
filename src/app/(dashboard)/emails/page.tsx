'use client'

import { useState } from 'react'
import { 
  Search,
  Filter,
  Plus,
  Star,
  Mail,
  Trash2,
  Archive,
  Tag
} from 'lucide-react'
import { Table } from '@/components/shared/Table'

const columns = [
  { key: 'subject', label: 'Subject', sortable: true },
  { key: 'from', label: 'From', sortable: true },
  { key: 'to', label: 'To', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions' },
]

const mockData = [
  {
    subject: 'Inspection Report - Central Building',
    from: 'inspector@proreport.com',
    to: 'client@company.com',
    date: '02/20/2024',
    status: (
      <span className="px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 rounded-full">
        Sent
      </span>
    ),
    actions: (
      <div className="flex items-center gap-2">
        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors">
          <Star className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors">
          <Archive className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  },
  // Add more data as needed
]

export default function EmailsPage() {
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(key)
      setSortDirection('asc')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Emails</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your email communications with clients and team members.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Email List
            </h3>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search email..."
                  className="pl-9 pr-4 py-2 w-full sm:w-64 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#FFB800] rounded-lg hover:bg-[#E6A600] transition-colors">
                <Plus className="w-4 h-4" />
                New Email
              </button>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          data={mockData}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      </div>
    </div>
  )
} 