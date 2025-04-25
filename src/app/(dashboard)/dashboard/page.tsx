import { MetricsCards } from '@/components/layout/MetricsCards'
import { TaskList } from '@/components/layout/TaskList'
import { Calendar } from '@/components/layout/Calendar'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-text-primary">Welcome back!</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Here's a summary of your business in the last 24 hours.
        </p>
      </div>

      <MetricsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskList />
        <Calendar />
      </div>
    </div>
  )
}
