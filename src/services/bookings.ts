// Supabase removido - protótipo frontend
import { toast } from 'sonner'
import { FormData as BookingFormData, initialFormData } from '@/components/forms/NewBookingForm/types'

export type BookingStatus = 'draft' | 'scheduled' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded'

export interface Booking {
  id: string
  client_id: string
  agent_id?: string
  property_address: string
  property_unit?: string
  inspection_type: string
  inspection_date: string
  notes?: string
  status: BookingStatus
  payment_status: PaymentStatus
  payment_method?: string
  payment_amount?: number
  payment_discount?: number
  contract_id?: string
  cover_letter_id?: string
  property_details?: {
    building_type?: string
    dwelling_type?: string
    stories?: number
    rooms?: number
    bathrooms?: number
    bedrooms?: number
    year_built?: number
    square_footage?: number
  }
  form_data: BookingFormData
  created_at: string
  updated_at: string
  user_id: string
}

export interface CreateBookingData {
  client_id?: string
  agent_id?: string
  property_address?: string
  property_unit?: string
  inspection_type?: string
  inspection_date?: string
  notes?: string
  status?: BookingStatus
  payment_status?: PaymentStatus
  payment_method?: string
  payment_amount?: number
  payment_discount?: number
  contract_id?: string
  cover_letter_id?: string
  property_details?: {
    building_type?: string
    dwelling_type?: string
    stories?: number
    rooms?: number
    bathrooms?: number
    bedrooms?: number
    year_built?: number
    square_footage?: number
  }
  form_data: BookingFormData
}

export interface UpdateBookingData extends Partial<CreateBookingData> {}

class BookingsService {
  constructor() {
    // Supabase removido - protótipo frontend
  }

  private async ensureAuth() {
    // Mock user para protótipo frontend
    return { id: 'mock-user', email: 'mock@user.com' }
  }

  async list() {
    try {
      const user = await this.ensureAuth()
      const now = new Date().toISOString()

      // Mock de agendamentos
      return [
        { 
          id: '1', client_id: '1', property_address: '123 Mock St', 
          inspection_date: '2025-04-25', status: 'draft', payment_status: 'pending', 
          user_id: user.id, created_at: now, updated_at: now, 
          inspection_type: 'Standard', 
          form_data: { 
            ...initialFormData, 
            clientInfo: { ...initialFormData.clientInfo, id: '1', name: 'Client 1 Mock' },
            generalInfo: { ...initialFormData.generalInfo, inspectionAddress: '123 Mock St', inspectionType: 'Standard', dateTime: '2025-04-25T10:00:00' }
          } 
        },
        { 
          id: '2', client_id: '2', property_address: '456 Sample Ave', 
          inspection_date: '2025-04-26', status: 'scheduled', payment_status: 'paid', 
          user_id: user.id, created_at: now, updated_at: now, 
          inspection_type: 'Condo', 
          form_data: { 
            ...initialFormData, 
            clientInfo: { ...initialFormData.clientInfo, id: '2', name: 'Client 2 Mock' }, 
            generalInfo: { ...initialFormData.generalInfo, inspectionAddress: '456 Sample Ave', inspectionType: 'Condo', dateTime: '2025-04-26T14:00:00' }
          } 
        }
      ] as Booking[]
    } catch (error: any) {
      console.error('Erro ao listar agendamentos:', error)
      if (error.message === 'User not authenticated') {
        toast.error('Usuário não autenticado. Por favor, faça login novamente.')
      } else {
        toast.error(error?.message || 'Erro ao listar agendamentos')
      }
      return []
    }
  }

  async getById(id: string) {
    const user = await this.ensureAuth()
    const now = new Date().toISOString()
    const mockAddress = `Imóvel ${id}`
    // Mock de busca por ID
    return {
      id,
      client_id: '1', // Mock client ID
      property_address: mockAddress,
      inspection_date: '2025-04-25',
      status: 'draft',
      payment_status: 'pending',
      user_id: user.id,
      created_at: now,
      updated_at: now,
      inspection_type: 'Standard', // Add mock inspection type
      form_data: { 
        ...initialFormData, 
        clientInfo: { ...initialFormData.clientInfo, id: '1', name: 'Client 1 Mock' },
        generalInfo: { ...initialFormData.generalInfo, inspectionAddress: mockAddress, inspectionType: 'Standard', dateTime: '2025-04-25T10:00:00' }
      } // Add correctly structured mock form data
    } as Booking
  }

  async create(booking: CreateBookingData) {
    const user = await this.ensureAuth()
    // Mock de criação
    return {
      id: Math.random().toString(36).substring(2, 9),
      ...booking,
      status: booking.status || 'draft',
      payment_status: booking.payment_status || 'pending',
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Booking
  }

  async update(id: string, booking: UpdateBookingData) {
    const user = await this.ensureAuth()
    const now = new Date().toISOString()
    // Mock de atualização
    return {
      id,
      ...booking,
      user_id: user.id,
      updated_at: now,
      // Note: Mock created_at ideally should not change on update
      created_at: now // Or fetch original booking created_at if needed
    } as Booking
  }

  async updateStatus(id: string, status: BookingStatus) {
    return this.update(id, { status })
  }

  async updatePaymentStatus(id: string, payment_status: PaymentStatus) {
    return this.update(id, { payment_status })
  }

  async delete(id: string) {
    // Mock de exclusão: não faz nada, apenas simula sucesso
    return true
  }

  // Métodos auxiliares
  getStatusLabel(status: BookingStatus) {
    const labels: Record<BookingStatus, string> = {
      draft: 'Rascunho',
      scheduled: 'Agendado',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    }
    return labels[status] || status
  }

  getStatusColor(status: BookingStatus) {
    const colors: Record<BookingStatus, string> = {
      draft: 'yellow',
      scheduled: 'blue',
      completed: 'green',
      cancelled: 'red'
    }
    return colors[status] || 'gray'
  }

  getPaymentStatusLabel(status: PaymentStatus) {
    const labels: Record<PaymentStatus, string> = {
      pending: 'Pendente',
      paid: 'Pago',
      partial: 'Parcial',
      refunded: 'Reembolsado'
    }
    return labels[status] || status
  }

  getPaymentStatusColor(status: PaymentStatus) {
    const colors: Record<PaymentStatus, string> = {
      pending: 'yellow',
      paid: 'green',
      partial: 'blue',
      refunded: 'gray'
    }
    return colors[status] || 'gray'
  }
}

export const bookingsService = new BookingsService()