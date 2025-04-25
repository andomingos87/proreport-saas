import { Task, TaskStatus } from '@/services/tasks'
import { CalendarClock, CheckCircle, Clock, Info, Tag, AlignJustify, Pencil, Trash2 } from 'lucide-react'
import { formatDistanceToNow, format, isPast, isToday, isTomorrow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (task: Task, status: TaskStatus) => void
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      pendente: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-800",
      em_andamento: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-500 dark:border-blue-800",
      concluída: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-500 dark:border-green-800",
      cancelada: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700"
    }
    return colors[status as keyof typeof colors] || colors.pendente
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      baixa: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-500 dark:border-blue-800",
      média: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-800",
      alta: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-500 dark:border-orange-800",
      urgente: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-500 dark:border-red-800"
    }
    return colors[priority as keyof typeof colors] || colors.média
  }

  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null
    
    const date = new Date(dateString)
    
    if (isToday(date)) {
      return `Hoje às ${format(date, "HH:mm", { locale: ptBR })}`
    } else if (isTomorrow(date)) {
      return `Amanhã às ${format(date, "HH:mm", { locale: ptBR })}`
    } else if (isPast(date)) {
      return `Atrasada (${formatDistanceToNow(date, { addSuffix: true, locale: ptBR })})`
    } else {
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    }
  }

  const getStatusLabel = (status: TaskStatus) => {
    const labels = {
      pendente: "Pendente",
      em_andamento: "Em andamento",
      concluída: "Concluída",
      cancelada: "Cancelada"
    }
    return labels[status]
  }

  const getPriorityLabel = (priority: string) => {
    const labels = {
      baixa: "Baixa",
      média: "Média",
      alta: "Alta",
      urgente: "Urgente"
    }
    return labels[priority as keyof typeof labels] || "Média"
  }

  const isDueDatePast = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'concluída' && task.status !== 'cancelada'

  return (
    <div className="w-full border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
            {getStatusLabel(task.status)}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
            {getPriorityLabel(task.priority)}
          </span>
          {task.dueDate && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${isDueDatePast ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-500 dark:border-red-800' : 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700'}`}>
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
        
        {task.description && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {task.description}
          </div>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mt-3">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              <span>{format(new Date(task.dueDate), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
            </div>
          )}
          {task.created_at && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span title={format(new Date(task.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}>
                Criada {formatDistanceToNow(new Date(task.created_at), { addSuffix: true, locale: ptBR })}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-2">
            {task.status !== 'concluída' && (
              <button 
                className="p-2 rounded-md text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={() => onStatusChange(task, 'concluída')}
                title="Marcar como concluída"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
            {task.status === 'concluída' && (
              <button 
                className="p-2 rounded-md text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                onClick={() => onStatusChange(task, 'pendente')}
                title="Marcar como pendente"
              >
                <Clock className="h-4 w-4" />
              </button>
            )}
            {task.status === 'pendente' && (
              <button 
                className="p-2 rounded-md text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => onStatusChange(task, 'em_andamento')}
                title="Marcar como em andamento"
              >
                <Info className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              onClick={() => onEdit(task)}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button 
              className="p-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => onDelete(task)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 