import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, MapPin, Calendar, Clock, DollarSign, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

type Booking = {
  id: string
  client_id: string
  property_address: string
  property_unit: string
  inspection_type: string
  inspection_date: string
  status: string
  payment_status: string
  payment_amount: string
  form_data: {
    clientInfo: {
      name: string
    }
  }
}

type BookingDetailsModalProps = {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
}

const statusColors = {
  scheduled: 'bg-info/10 text-info font-medium',
  completed: 'bg-success/10 text-success font-medium',
  cancelled: 'bg-error/10 text-error font-medium',
  pending: 'bg-warning/10 text-warning font-medium'
}

const paymentStatusColors = {
  paid: 'bg-success/10 text-success font-medium',
  pending: 'bg-warning/10 text-warning font-medium',
  cancelled: 'bg-error/10 text-error font-medium'
}

export function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  const router = useRouter()

  if (!booking) return null

  const handleEdit = () => {
    router.push(`/bookings/${booking.id}/edit`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[640px] p-6 bg-[var(--bg-primary)] border border-[var(--border-light)] shadow-lg rounded-lg">
        <DialogHeader className="mb-6 space-y-1">
          <DialogTitle className="text-2xl font-semibold text-[var(--text-primary)]">
            Detalhes do Agendamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-wrap gap-3">
              <Badge 
                className={`px-3 py-1.5 rounded-md text-sm transition-colors duration-150 ${
                  statusColors[booking.status as keyof typeof statusColors]
                }`}
              >
                {booking.status === 'scheduled' && 'Agendado'}
                {booking.status === 'completed' && 'Concluído'}
                {booking.status === 'cancelled' && 'Cancelado'}
                {booking.status === 'pending' && 'Pendente'}
              </Badge>
              <Badge 
                className={`px-3 py-1.5 rounded-md text-sm transition-colors duration-150 ${
                  paymentStatusColors[booking.payment_status as keyof typeof paymentStatusColors]
                }`}
              >
                {booking.payment_status === 'paid' && 'Pago'}
                {booking.payment_status === 'pending' && 'Pagamento Pendente'}
                {booking.payment_status === 'cancelled' && 'Pagamento Cancelado'}
              </Badge>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleEdit} 
                variant="outline" 
                size="sm" 
                className="bg-[var(--bg-primary)] border-[var(--border-light)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors duration-150"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button 
                onClick={() => router.push(`/inspections/${booking.id}`)} 
                size="sm"
                className="bg-[var(--brand-primary)] text-white hover:opacity-90 transition-colors duration-150"
              >
                Iniciar Inspeção
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[var(--text-secondary)] mt-1" />
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Cliente</p>
                  <p className="text-base text-[var(--text-primary)] font-medium">
                    {booking.form_data.clientInfo.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--text-secondary)] mt-1" />
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Endereço</p>
                  <p className="text-base text-[var(--text-primary)] font-medium">
                    {booking.property_address}
                    {booking.property_unit && `, ${booking.property_unit}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[var(--text-secondary)] mt-1" />
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Data</p>
                  <p className="text-base text-[var(--text-primary)] font-medium">
                    {new Date(booking.inspection_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[var(--text-secondary)] mt-1" />
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Horário</p>
                  <p className="text-base text-[var(--text-primary)] font-medium">
                    {new Date(booking.inspection_date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-[var(--text-secondary)] mt-1" />
                <div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Valor</p>
                  <p className="text-base text-[var(--text-primary)] font-medium">
                    {formatCurrency(Number(booking.payment_amount))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 