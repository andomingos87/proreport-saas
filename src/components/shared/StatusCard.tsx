'use client'

import { LucideIcon } from 'lucide-react'

interface StatusCardProps {
  title: string
  value: string
  icon: LucideIcon
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  trend?: {
    value: string
    direction: 'up' | 'down'
  }
}

const variantStyles = {
  primary: {
    background: 'bg-[#6C5DD3]/10 dark:bg-[#6C5DD3]/20',
    text: 'text-[#6C5DD3]',
    icon: 'text-[#6C5DD3]',
  },
  success: {
    background: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-700 dark:text-green-400',
    icon: 'text-green-700 dark:text-green-400',
  },
  warning: {
    background: 'bg-yellow-100 dark:bg-yellow-900/50',
    text: 'text-yellow-700 dark:text-yellow-400',
    icon: 'text-yellow-700 dark:text-yellow-400',
  },
  danger: {
    background: 'bg-red-100 dark:bg-red-900/50',
    text: 'text-red-700 dark:text-red-400',
    icon: 'text-red-700 dark:text-red-400',
  },
  info: {
    background: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-700 dark:text-blue-400',
  },
}

export function StatusCard({ title, value, icon: Icon, variant, trend }: StatusCardProps) {
  const styles = variantStyles[variant]

  return (
    <div className={`p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className={`mt-1 text-sm font-medium flex items-center gap-1 ${
              trend.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {trend.value}
            </p>
          )}
        </div>

        <div className={`p-3 rounded-lg ${styles.background}`}>
          <Icon className={`w-6 h-6 ${styles.icon}`} />
        </div>
      </div>
    </div>
  )
} 