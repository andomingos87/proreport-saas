'use client'

import { useState } from 'react'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  Download,
  Edit,
  Send,
  Search,
  Filter
} from 'lucide-react'
import { StatusCard } from '@/components/shared/StatusCard'
import { Table } from '@/components/shared/Table'
import { Button } from '@/components/ui/button'
const statusCards = [
  {
    title: 'Scheduled',
    value: '24',
    icon: Calendar,
    variant: 'primary' as const,
  },
  {
    title: 'In Progress',
    value: '12',
    icon: Clock,
    variant: 'warning' as const,
  },
  {
    title: 'Completed',
    value: '156',
    icon: CheckCircle,
    variant: 'success' as const,
  },
  {
    title: 'Cancelled',
    value: '8',
    icon: XCircle,
    variant: 'danger' as const,
  },
]

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'client', label: 'Client', sortable: true },
  { key: 'property', label: 'Property', sortable: true },
  { key: 'inspector', label: 'Inspector', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions' },
]

const mockData = [
  {
    id: '#REL-001',
    client: 'Maria Santos',
    property: 'Apartment 101 - Central Building',
    inspector: 'Carlos Oliveira',
    date: '02/20/2024',
    status: (
      <span className="px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 rounded-full">
        Completed
      </span>
    ),
    actions: (
      <div className="flex items-center gap-2">
        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-[#6C5DD3] dark:hover:text-[#6C5DD3] transition-colors">
          <Download className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-[#6C5DD3] dark:hover:text-[#6C5DD3] transition-colors">
          <Edit className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-[#6C5DD3] dark:hover:text-[#6C5DD3] transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    ),
  },
  // Add more data as needed
]

export default function ReportsPage() {
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
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Reports</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage all inspection reports and their status.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statusCards.map((card) => (
          <StatusCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            variant={card.variant}
          />
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Reports List
            </h3>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search report..."
                  className="pl-9 pr-4 py-2 w-full sm:w-64 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <Button
                variant="default"
              >
                New Report
              </Button>
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