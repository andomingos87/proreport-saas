import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Usar tipo Booking do serviço
import type { Booking } from '@/services/bookings'

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Simula carregamento de dados mocados
    setTimeout(() => {
      setBookings([
        {
          id: '1',
          client_id: '1',
          user_id: 'mock-user',
          property_address: 'Imóvel 1',
          property_unit: '',
          inspection_type: 'residential',
          inspection_date: '2025-04-25T10:00:00',
          status: 'draft',
          payment_status: 'pending',
          payment_method: 'pix',
          payment_amount: 500,
          payment_discount: 0,
          contract_id: undefined,
          cover_letter_id: undefined,
          property_details: undefined,
          form_data: {
            clientInfo: { name: 'Cliente 1' }
          },
          created_at: '2025-04-20T09:00:00',
          updated_at: '2025-04-20T09:00:00',
          notes: ''
        },
        {
          id: '2',
          client_id: '2',
          user_id: 'mock-user',
          property_address: 'Imóvel 2',
          property_unit: 'Apt 202',
          inspection_type: 'commercial',
          inspection_date: '2025-04-26T14:00:00',
          status: 'scheduled',
          payment_status: 'paid',
          payment_method: 'cartao',
          payment_amount: 800,
          payment_discount: 50,
          contract_id: undefined,
          cover_letter_id: undefined,
          property_details: undefined,
          form_data: {
            clientInfo: { name: 'Cliente 2' }
          },
          created_at: '2025-04-21T12:00:00',
          updated_at: '2025-04-21T12:00:00',
          notes: ''
        }
      ])
      setLoading(false)
    }, 500)
  }, [])

  return { bookings, loading, error }
} 