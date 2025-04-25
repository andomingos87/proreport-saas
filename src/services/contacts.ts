// Supabase removido - protótipo frontend

export type ContactType = 'client' | 'agent' | 'other'

export interface Contact {
  id: string
  name: string
  company?: string
  email?: string
  phone?: string
  type: ContactType
  notes?: string
  address?: string
  city?: string
  province?: string
  zipCode?: string
  country?: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface CreateContactData {
  name: string
  company?: string
  email?: string
  phone?: string
  type: ContactType
  notes?: string
  address?: string
  city?: string
  province?: string
  zipCode?: string
  country?: string
}

export interface UpdateContactData extends Partial<CreateContactData> {}

class ContactsService {
  constructor() {
    // Supabase removido - protótipo frontend
  }

  private async ensureAuth() {
    // Mock user para protótipo frontend
    return { id: 'mock-user', email: 'mock@user.com' }
  }

  async list() {
    const user = await this.ensureAuth()

    // Mock de contatos
    const now = new Date().toISOString()
    return [
      { id: '1', name: 'João Silva', email: 'joao.silva@email.com', phone: '11999999991', zipCode: '11111-111', user_id: user.id, type: 'client', created_at: now, updated_at: now },
      { id: '2', name: 'Maria Oliveira (Agente)', email: 'maria.oliveira@email.com', phone: '11888888882', zipCode: '22222-222', user_id: user.id, type: 'agent', created_at: now, updated_at: now },
      { id: '3', name: 'Outro Contato', email: 'outro@email.com', phone: '11777777773', zipCode: '33333-333', user_id: user.id, type: 'other', created_at: now, updated_at: now }
    ] as Contact[]
  }

  async create(contact: CreateContactData) {
    const user = await this.ensureAuth()
    // Mock de criação de contato
    const newContact = { ...contact, id: Math.random().toString(36).substring(2, 9), user_id: user.id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    return newContact as Contact
  }

  async update(id: string, contact: UpdateContactData) {
    const user = await this.ensureAuth()
    const now = new Date().toISOString()
    // Mock de atualização
    return {
      id,
      ...contact,
      user_id: user.id,
      created_at: now, // Mock: ideally fetch original created_at
      updated_at: now
    } as Contact
  }

  async delete(id: string) {
    // Mock de exclusão: não faz nada, apenas simula sucesso
    return true
  }
}

export const contactsService = new ContactsService()