import { useState, useEffect, FormEvent } from 'react'
import { CreateTaskData, Task, TaskPriority, TaskStatus } from '@/services/tasks'
import { X, Clock, Calendar } from 'lucide-react'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateTaskData) => Promise<void>
  initialData?: Task
  contactId?: string
  title?: string
}

export function TaskForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  contactId,
  title = 'Nova Tarefa'
}: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('pendente')
  const [priority, setPriority] = useState<TaskPriority>('média')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const statusOptions: { value: TaskStatus, label: string }[] = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'em_andamento', label: 'Em andamento' },
    { value: 'concluída', label: 'Concluída' },
    { value: 'cancelada', label: 'Cancelada' }
  ]

  const priorityOptions: { value: TaskPriority, label: string }[] = [
    { value: 'baixa', label: 'Baixa' },
    { value: 'média', label: 'Média' },
    { value: 'alta', label: 'Alta' },
    { value: 'urgente', label: 'Urgente' }
  ]

  useEffect(() => {
    if (initialData) {
      setTaskTitle(initialData.title || '')
      setDescription(initialData.description || '')
      setStatus(initialData.status || 'pendente')
      setPriority(initialData.priority || 'média')
      
      if (initialData.dueDate) {
        const date = new Date(initialData.dueDate)
        setDueDate(date.toISOString().split('T')[0]) // Data no formato YYYY-MM-DD
        
        // Formatação da hora - padronizando para formato HH:MM
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        setDueTime(`${hours}:${minutes}`)
      } else {
        setDueDate('')
        setDueTime('')
      }
    } else {
      // Valores padrão para novo registro
      setTaskTitle('')
      setDescription('')
      setStatus('pendente')
      setPriority('média')
      setDueDate('')
      setDueTime('')
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!taskTitle.trim()) {
      newErrors.title = 'Título é obrigatório'
    }

    // Validação opcional: se tem data, deve ter hora e vice-versa
    if (dueDate && !dueTime) {
      newErrors.dueTime = 'Informe a hora se deseja definir um prazo'
    }
    if (dueTime && !dueDate) {
      newErrors.dueDate = 'Informe a data se deseja definir um prazo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      // Combinar data e hora em um único timestamp ISO
      let combinedDueDate = undefined
      if (dueDate && dueTime) {
        const [year, month, day] = dueDate.split('-')
        const [hours, minutes] = dueTime.split(':')
        const dateObject = new Date(
          parseInt(year), 
          parseInt(month) - 1, // Mês em JavaScript é 0-indexed
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        )
        combinedDueDate = dateObject.toISOString()
      }

      const formData: CreateTaskData = {
        title: taskTitle,
        description: description || undefined,
        status,
        priority,
        dueDate: combinedDueDate,
        contactId
      }

      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título*
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              placeholder="Título da tarefa"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Descrição da tarefa"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Data de vencimento
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full p-2 border ${errors.dueDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Hora
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className={`w-full p-2 border ${errors.dueTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {errors.dueTime && (
                <p className="mt-1 text-sm text-red-500">{errors.dueTime}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 