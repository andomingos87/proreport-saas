'use client'

import { useEffect, useState } from 'react'
import { Contact, contactsService } from '@/services/contacts'
import { 
  FormData, 
  inputClasses, 
  labelClasses 
} from './types'
import { User2, Phone, Mail, Building2, MapPin } from 'lucide-react'

type AgentInfoStepProps = {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

export function AgentInfoStep({ formData, setFormData }: AgentInfoStepProps) {
  const [agents, setAgents] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const data = await contactsService.list()
        const agentsOnly = data.filter(contact => contact.type === 'agent')
        setAgents(agentsOnly)
      } catch (error) {
        console.error('Erro ao carregar agentes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [])

  const selectAgent = (agent: Contact) => {
    setFormData({
      ...formData,
      agentInfo: {
        name: agent.name,
        phone: agent.phone || '',
        email: agent.email || '',
        address: agent.address || '',
        city: agent.city || '',
        state: agent.province || '',
        zip: agent.zipCode || '',
        county: agent.country || '',
        notes: ''
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB800]" />
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <User2 className="w-16 h-16 text-gray-400 dark:text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Nenhum agente encontrado
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Você ainda não possui agentes cadastrados.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {agents.map((agent) => (
        <div
          key={agent.id}
          onClick={() => selectAgent(agent)}
          className={`py-4 px-2 cursor-pointer ${
            formData.agentInfo.name === agent.name
              ? 'bg-[#FFB800]/10'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {agent.name}
                </p>
                {agent.company && (
                  <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Building2 className="w-4 h-4 mr-1" />
                    {agent.company}
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center space-x-4">
                {agent.phone && (
                  <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-1" />
                    {agent.phone}
                  </span>
                )}
                {agent.email && (
                  <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-1" />
                    {agent.email}
                  </span>
                )}
                {agent.address && (
                  <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {agent.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
