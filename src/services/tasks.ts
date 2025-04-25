// Supabase removido - protótipo frontend

export type TaskStatus = 'pendente' | 'em_andamento' | 'concluída' | 'cancelada'
export type TaskPriority = 'baixa' | 'média' | 'alta' | 'urgente'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  contactId?: string
  completed_at?: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface CreateTaskData {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  contactId?: string
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

class TasksService {
  constructor() {
    // Supabase removido - protótipo frontend
  }

  private async ensureAuth() {
    // Mock user para protótipo frontend
    return { id: 'mock-user', email: 'mock@user.com' }
  }

  private mapToDatabase(task: CreateTaskData | UpdateTaskData) {
    const mappedTask = { ...task } as any

    // Mapeando campos camelCase para snake_case do banco
    if (mappedTask.dueDate !== undefined) {
      mappedTask.due_date = mappedTask.dueDate
      delete mappedTask.dueDate
    }

    if (mappedTask.contactId !== undefined) {
      mappedTask.contact_id = mappedTask.contactId
      delete mappedTask.contactId
    }

    return mappedTask
  }

  private mapFromDatabase(task: any): Task {
    const result = { ...task } as any

    // Mapeando campos snake_case do banco para camelCase
    if (result.due_date !== undefined) {
      result.dueDate = result.due_date
      delete result.due_date
    }

    if (result.contact_id !== undefined) {
      result.contactId = result.contact_id
      delete result.contact_id
    }

    return result as Task
  }

  async list() {
    const user = await this.ensureAuth()

    // Mock de tarefas
    return [
      { id: '1', title: 'Tarefa 1', status: 'pendente', user_id: user.id },
      { id: '2', title: 'Tarefa 2', status: 'concluída', user_id: user.id }
    ] as Task[]
  }

  async listByContact(contactId: string) {
    const user = await this.ensureAuth()
    // Mock de tarefas por contato
    return [
      { id: '1', title: 'Tarefa 1', status: 'pendente', user_id: user.id, contactId },
      { id: '2', title: 'Tarefa 2', status: 'concluída', user_id: user.id, contactId }
    ] as Task[]
  }

  async listByStatus(status: TaskStatus) {
    const user = await this.ensureAuth()
    // Mock de tarefas por status
    return [
      { id: '1', title: 'Tarefa 1', status, user_id: user.id },
      { id: '2', title: 'Tarefa 2', status, user_id: user.id }
    ] as Task[]
  }

  async getById(id: string) {
    const user = await this.ensureAuth()
    // Mock de busca por ID
    return {
      id,
      title: `Tarefa ${id}`,
      status: 'pendente',
      user_id: user.id
    } as Task
  }

  async create(task: CreateTaskData) {
    const user = await this.ensureAuth()
    // Mock de criação
    return {
      id: Math.random().toString(36).substring(2, 9),
      ...task,
      user_id: user.id,
      status: task.status || 'pendente',
      priority: task.priority || 'média'
    } as Task
  }

  async update(id: string, task: UpdateTaskData) {
    const user = await this.ensureAuth()
    // Mock de atualização
    return {
      id,
      ...task,
      user_id: user.id
    } as Task
  }

  async updateStatus(id: string, status: TaskStatus) {
    return this.update(id, { status })
  }

  async delete(id: string) {
    // Mock de exclusão: não faz nada, apenas simula sucesso
    return true
  }
}

export const tasksService = new TasksService() 