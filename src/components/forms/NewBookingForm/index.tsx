'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { contactsService } from '@/services/contacts'
import { bookingsService, BookingStatus, PaymentStatus } from '@/services/bookings'
import { toast } from 'sonner'

import { 
  Client,
  FormData, 
  NewBookingFormProps,
  steps,
  initialFormData
} from './types'

// Import step components
import { ClientInfoStep } from './ClientInfoStep'
import { GeneralInfoStep } from './GeneralInfoStep'
import { AgentInfoStep } from './AgentInfoStep'
import { PropertyInfoStep } from './PropertyInfoStep'
import { AgreementStep } from './AgreementStep'
import { CoverLetterStep } from './CoverLetterStep'
import { PaymentStep } from './PaymentStep'
import { ReviewStep } from './ReviewStep'

export default function NewBookingForm({ isOpen, onClose }: NewBookingFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Estado para o ID do booking em andamento
  const [bookingId, setBookingId] = useState<string | null>(null)
  
  // Client state
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await contactsService.list()
        // Filtra apenas os contatos do tipo 'client'
        const clientsOnly = data.filter(contact => contact.type === 'client') as unknown as Client[]
        setClients(clientsOnly)
      } catch (error) {
        console.error('Erro ao carregar clientes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadClients()
  }, [])

  if (!isOpen) return null

  // Função para criar ou atualizar o agendamento no banco de dados
  const updateBookingInDatabase = async (currentFormData: FormData, currentStep: number) => {
    try {
      // Verificar se há dados mínimos para salvar
      if (currentStep === 0 && !currentFormData.clientInfo.id) {
        // Para a primeira etapa, um cliente deve ser selecionado
        toast.warning('Por favor, selecione um cliente para continuar')
        return false
      }

      // Criar o objeto base com os dados obrigatórios
      const bookingData: any = {
        property_address: currentFormData.generalInfo.inspectionAddress || '',
        property_unit: currentFormData.generalInfo.addressUnit || '',
        inspection_type: currentFormData.generalInfo.inspectionType || '',
        notes: currentFormData.generalInfo.notes || '',
        payment_method: currentFormData.payment.method || '',
        status: (currentStep === steps.length - 1 ? 'scheduled' : 'draft') as BookingStatus,
        payment_status: currentStep === steps.length - 1 && currentFormData.payment.method ? ('pending' as PaymentStatus) : undefined,
        form_data: currentFormData, // Armazena todo o objeto de formulário
      }

      // Adicionar inspection_date apenas se for uma data válida
      if (currentFormData.generalInfo.dateTime) {
        const date = new Date(currentFormData.generalInfo.dateTime)
        if (!isNaN(date.getTime())) {
          bookingData.inspection_date = date.toISOString()
        }
      }

      // Adicionar campos UUID apenas se não forem vazios
      if (currentFormData.clientInfo.id) {
        bookingData.client_id = currentFormData.clientInfo.id
      }

      if (currentFormData.agreement.selectedContract) {
        bookingData.contract_id = currentFormData.agreement.selectedContract
      }

      if (currentFormData.coverLetter.selectedCoverLetter) {
        bookingData.cover_letter_id = currentFormData.coverLetter.selectedCoverLetter
      }

      // Adicionar campos opcionais de pagamento
      if (currentFormData.payment.price) {
        bookingData.payment_amount = parseFloat(currentFormData.payment.price)
      }

      if (currentFormData.payment.discount) {
        bookingData.payment_discount = parseFloat(currentFormData.payment.discount)
      }

      // Adicionar detalhes da propriedade
      bookingData.property_details = {
        building_type: currentFormData.propertyInfo.buildingType,
        dwelling_type: currentFormData.propertyInfo.dwellingType,
      }

      // Adicionar campos numéricos apenas se tiverem valores válidos
      if (currentFormData.propertyInfo.stories) {
        bookingData.property_details.stories = parseInt(currentFormData.propertyInfo.stories)
      }

      if (currentFormData.propertyInfo.rooms) {
        bookingData.property_details.rooms = parseInt(currentFormData.propertyInfo.rooms)
      }

      if (currentFormData.propertyInfo.bathrooms) {
        bookingData.property_details.bathrooms = parseInt(currentFormData.propertyInfo.bathrooms)
      }

      if (currentFormData.propertyInfo.bedrooms) {
        bookingData.property_details.bedrooms = parseInt(currentFormData.propertyInfo.bedrooms)
      }

      if (currentFormData.propertyInfo.yearBuilt) {
        bookingData.property_details.year_built = parseInt(currentFormData.propertyInfo.yearBuilt)
      }

      if (currentFormData.propertyInfo.squareFootage) {
        bookingData.property_details.square_footage = parseInt(currentFormData.propertyInfo.squareFootage)
      }

      if (bookingId) {
        // Atualizar booking existente
        await bookingsService.update(bookingId, bookingData)
      } else {
        // Criar novo booking
        const result = await bookingsService.create(bookingData)
        setBookingId(result.id)
      }
      return true
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error)
      toast.error('Erro ao salvar os dados do agendamento')
      return false
    }
  }

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      try {
        // Atualizar o banco de dados antes de avançar
        const success = await updateBookingInDatabase(formData, currentStep)
        
        // Só avança se a atualização foi bem-sucedida
        if (success) {
          setCurrentStep(currentStep + 1)
        }
      } catch (error) {
        console.error('Erro ao avançar para o próximo passo:', error)
        toast.error('Não foi possível avançar. Verifique os dados informados.')
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // Finalizar o agendamento
      await updateBookingInDatabase(formData, steps.length - 1)
      
      toast.success('Agendamento criado com sucesso!')
      console.log('Agendamento finalizado:', formData)
      onClose()
    } catch (error) {
      console.error('Erro ao finalizar agendamento:', error)
      toast.error('Erro ao finalizar o agendamento')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ClientInfoStep 
            formData={formData} 
            setFormData={setFormData} 
            clients={clients} 
            setClients={setClients} 
          />
        )
      case 1:
        return (
          <GeneralInfoStep 
            formData={formData} 
            setFormData={setFormData} 
          />
        )
      case 2:
        return (
          <AgentInfoStep 
            formData={formData} 
            setFormData={setFormData} 
          />
        )
      case 3:
        return (
          <PropertyInfoStep 
            formData={formData} 
            setFormData={setFormData} 
          />
        )
      case 4:
        return (
          <AgreementStep 
            formData={formData} 
            setFormData={setFormData} 
          />
        )
      case 5:
        return (
          <CoverLetterStep 
            formData={formData} 
            setFormData={setFormData} 
          />
        )
      case 6:
        return (
          <PaymentStep 
            formData={formData} 
            setFormData={setFormData} 
          />
        )
      case 7:
        return (
          <ReviewStep 
            formData={formData} 
            setCurrentStep={setCurrentStep} 
          />
        )
      default:
        return <div>Em construção...</div>
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity" />
        
        <div className="relative w-full max-w-5xl bg-white dark:bg-gray-800 shadow-lg rounded-xl flex flex-col h-[calc(100vh-80px)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Nova Inspeção</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {steps[currentStep].description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Steps Navigation */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`flex items-center ${
                    index < steps.length - 1
                      ? 'flex-1'
                      : ''
                  }`}
                >
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                      index < currentStep
                        ? 'border-[#FFB800] bg-[#FFB800] text-white hover:bg-[#E6A600]'
                        : index === currentStep
                        ? 'border-[#FFB800] text-[#FFB800] dark:text-[#FFB800] cursor-default'
                        : 'border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-400 dark:hover:text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 ${
                        index < currentStep
                          ? 'bg-[#FFB800]'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`text-xs font-medium ${
                    index === currentStep
                      ? 'text-[#FFB800] dark:text-[#FFB800]'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-white dark:bg-gray-800">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-white dark:bg-gray-800 flex-shrink-0">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                  currentStep === 0
                    ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>

              <button
                type="button"
                onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-[#FFB800] px-4 py-2 text-sm font-medium text-white hover:bg-[#E6A600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === steps.length - 1 ? (
                  submitting ? 'Processando...' : 'Finalizar'
                ) : (
                  <>
                    Próximo
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
