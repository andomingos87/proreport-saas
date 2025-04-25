'use client'

import { Users, Building, FileText, DollarSign } from 'lucide-react'

const metrics = [
  {
    label: 'Contacts',
    values: [
      { label: 'Clients', value: '7' },
      { label: 'Agents', value: '3' }
    ],
    icon: Users,
    trend: 'up',
  },
  {
    label: 'Properties',
    values: [
      { label: 'Residential', value: '7' },
      { label: 'Commercial', value: '3' }
    ],
    icon: Building,
    trend: 'up',
  },
  {
    label: 'Reports',
    values: [
      { label: 'Completed', value: '7' },
      { label: 'In Progress', value: '3' }
    ],
    icon: FileText,
    trend: 'up',
  },
  {
    label: 'Revenues',
    values: [
      { label: 'This Month', value: '$7,000' },
      { label: 'Total', value: '$3,000' }
    ],
    icon: DollarSign,
    trend: 'up',
  },
]

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <div
            key={metric.label}
            className="p-6 bg-bg-primary rounded-xl shadow-sm border border-border-light"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">
                {metric.label}
              </span>
              <div className="p-2 bg-brand-primary-light rounded-lg">
                <Icon className="w-5 h-5 text-brand-primary" />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {metric.values.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{item.label}:</span>
                  <span className="text-sm font-medium text-text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
} 