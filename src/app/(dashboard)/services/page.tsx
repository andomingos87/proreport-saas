'use client'

import { useState } from 'react'
import { 
  Search,
  Filter,
  Plus,
  Briefcase,
  Clock,
  DollarSign,
  BarChart,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react'
import { StatusCard } from '@/components/shared/StatusCard'
import { Table } from '@/components/shared/Table'

const statusCards = [
  {
    title: 'Active Services',
    value: '48',
    icon: Briefcase,
    variant: 'primary' as const,
  },
  {
    title: 'Pending',
    value: '12',
    icon: Clock,
    variant: 'warning' as const,
  },
  {
    title: 'Monthly Revenue',
    value: '$24,500',
    icon: DollarSign,
    variant: 'success' as const,
  },
  {
    title: 'Growth Rate',
    value: '+15.3%',
    icon: BarChart,
    variant: 'info' as const,
  },
]

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Service Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'duration', label: 'Duration', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions' },
]

const mockData = [
  {
    id: '#SRV-001',
    name: 'Complete Property Inspection',
    category: 'Inspection',
    price: '$299.99',
    duration: '2-3 hours',
    status: (
      <span className="px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 rounded-full">
        Active
      </span>
    ),
    actions: (
      <div className="flex items-center gap-2">
        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-[#6C5DD3] dark:hover:text-[#6C5DD3] transition-colors">
          <Edit className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-[#6C5DD3] dark:hover:text-[#6C5DD3] transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
        <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  },
  // Add more data as needed
]

export default function ServicesPage() {
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
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Services</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your service offerings and pricing.
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
              Services List
            </h3>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search service..."
                  className="pl-9 pr-4 py-2 w-full sm:w-64 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6C5DD3] rounded-lg hover:bg-[#5B4EC7] transition-colors">
                <Plus className="w-4 h-4" />
                New Service
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