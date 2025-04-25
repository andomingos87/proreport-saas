'use client'

import { useState } from 'react'
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'

type Task = {
  id: string
  title: string
  description: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  status: 'upcoming' | 'in_progress'
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Property Inspection - Central Building',
    description: 'Complete inspection report for all floors',
    dueDate: '2024-03-10',
    priority: 'high',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Client Meeting - Tech Solutions',
    description: 'Review inspection findings and recommendations',
    dueDate: '2024-03-12',
    priority: 'medium',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Safety Compliance Review',
    description: 'Update safety protocols documentation',
    dueDate: '2024-03-15',
    priority: 'high',
    status: 'in_progress'
  },
  {
    id: '4',
    title: 'Equipment Maintenance Check',
    description: 'Perform routine equipment maintenance',
    dueDate: '2024-03-18',
    priority: 'low',
    status: 'in_progress'
  },
]

const priorityColors = {
  low: 'bg-state-info/20 text-state-info',
  medium: 'bg-state-warning/20 text-state-warning',
  high: 'bg-state-error/20 text-state-error'
}

export function TaskList() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'in_progress'>('upcoming')

  const filteredTasks = mockTasks.filter(task => task.status === activeTab)

  return (
    <div className="bg-bg-primary rounded-xl shadow-sm">
      <div className="p-6 border-b border-border-light">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-text-primary">Tasks</h3>
        </div>

        <div className="flex space-x-4 border-b border-border-light">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 text-sm font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`pb-4 text-sm font-medium transition-colors ${
              activeTab === 'in_progress'
                ? 'text-brand-primary border-b-2 border-brand-primary'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            In Progress
          </button>
        </div>
      </div>


      <div className="p-6">
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="p-4 border border-border-light rounded-lg hover:border-brand-primary transition-colors bg-bg-primary"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">{task.title}</h4>
                  <p className="mt-1 text-sm text-text-secondary">{task.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  {task.status === 'upcoming' ? (
                    <Clock className="w-4 h-4 text-state-warning" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-state-info" />
                  )}
                  {task.status === 'upcoming' ? 'Próxima' : 'Em Andamento'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 