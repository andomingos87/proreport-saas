// Supabase removido - protótipo frontend

export type ContractStatus = 'draft' | 'sent' | 'signed' | 'expired'

export interface Contract {
  id: string
  title: string
  content: string
  description?: string
  is_template: boolean
  tags?: string[]
  status: ContractStatus
  created_at: string
  updated_at: string
  user_id: string
}

export interface CreateContractData {
  title: string
  content: string
  description?: string
  is_template?: boolean
  tags?: string[]
  status?: ContractStatus
}

export interface UpdateContractData extends Partial<CreateContractData> {}

class ContractsService {
  constructor() {
    // Supabase removido - protótipo frontend
  }

  private async ensureAuth() {
    // Mock user para protótipo frontend
    return { id: 'mock-user', email: 'mock@user.com' }
  }

  async list(options?: { isTemplate?: boolean, status?: ContractStatus }) {
    const user = await this.ensureAuth()
    // Mock de contratos
    let data = [
      { id: '1', title: 'Contrato Template', status: 'draft', user_id: user.id, is_template: true, content: 'Conteúdo template', created_at: '2024-01-01', updated_at: '2024-01-01' },
      { id: '2', title: 'Contrato Cliente A', status: 'signed', user_id: user.id, is_template: false, content: 'Conteúdo cliente A', created_at: '2024-02-10', updated_at: '2024-02-12' },
      { id: '3', title: 'Contrato Cliente B', status: 'sent', user_id: user.id, is_template: false, content: 'Conteúdo cliente B', created_at: '2024-03-15', updated_at: '2024-03-15' },
    ]
    if (options?.isTemplate !== undefined) {
      data = data.filter(contract => contract.is_template === options.isTemplate)
    }
    if (options?.status !== undefined) {
      data = data.filter(contract => contract.status === options.status)
    }
    return data as Contract[]
  }

  async getById(id: string) {
    const user = await this.ensureAuth()
    // Mock de busca por ID
    return {
      id,
      title: `Contrato ${id}`,
      status: 'draft',
      user_id: user.id
    } as Contract
  }

  async create(contract: CreateContractData) {
    const user = await this.ensureAuth()
    // Mock de criação
    return {
      id: Math.random().toString(36).substring(2, 9),
      ...contract,
      status: contract.status || 'draft',
      user_id: user.id
    } as Contract
  }

  async duplicate(id: string, newTitle?: string) {
    const original = await this.getById(id)
    
    if (!original) {
      throw new Error('Contrato não encontrado')
    }
    
    const duplicateData: CreateContractData = {
      title: newTitle || `${original.title} (Cópia)`,
      content: original.content,
      description: original.description,
      is_template: original.is_template,
      tags: original.tags,
      status: 'draft' // Sempre começa como rascunho
    }
    
    return this.create(duplicateData)
  }

  async update(id: string, contract: UpdateContractData) {
    const user = await this.ensureAuth()
    // Mock de atualização
    return {
      id,
      ...contract,
      user_id: user.id
    } as Contract
  }

  async updateStatus(id: string, status: ContractStatus) {
    return this.update(id, { status })
  }

  async delete(id: string) {
    // Mock de exclusão: não faz nada, apenas simula sucesso
    return true
  }

  // Métodos de auxílio para exportação e envio por email
  getStatusLabel(status: ContractStatus) {
    const labels: Record<ContractStatus, string> = {
      draft: 'Rascunho',
      sent: 'Enviado',
      signed: 'Assinado',
      expired: 'Expirado'
    }
    return labels[status] || status
  }

  getStatusColor(status: ContractStatus) {
    const colors: Record<ContractStatus, string> = {
      draft: 'yellow',
      sent: 'blue',
      signed: 'green',
      expired: 'red'
    }
    return colors[status] || 'gray'
  }
}

export const contractsService = new ContractsService()