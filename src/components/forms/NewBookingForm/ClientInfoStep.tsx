'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { 
  Client, 
  FormData, 
  inputClasses, 
  labelClasses 
} from './types'

type ClientInfoStepProps = {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  clients: Client[]
  setClients: React.Dispatch<React.SetStateAction<Client[]>>
}

export function ClientInfoStep({ 
  formData, 
  setFormData, 
  clients, 
  setClients 
}: ClientInfoStepProps) {
  const [showNewClientModal, setShowNewClientModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    formData.clientInfo.id ? 
      clients.find(client => client.id === formData.clientInfo.id) || null : 
      null
  )
  const [searchQuery, setSearchQuery] = useState('')

  // Se já houver um client_id preenchido, encontre e selecione o cliente
  useEffect(() => {
    if (formData.clientInfo.id && clients.length > 0 && !selectedClient) {
      const client = clients.find(c => c.id === formData.clientInfo.id)
      if (client) {
        setSelectedClient(client)
      }
    }
  }, [formData.clientInfo.id, clients, selectedClient])

  const handleNewClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de salvar cliente
    setShowNewClientModal(false)
  }

  const selectClient = (client: Client) => {
    setSelectedClient(client)
    setFormData({
      ...formData,
      clientInfo: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        state: client.province,
        zip: client.zip_code,
        county: client.country,
        notes: client.notes || ''
      }
    })
    toast.success(`Cliente ${client.name} selecionado`)
  }

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {clients.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              Nenhum cliente cadastrado
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Comece cadastrando seu primeiro cliente para criar uma nova inspeção.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowNewClientModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#FFB800] hover:bg-[#E6A600]"
              >
                Cadastrar Cliente
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Client Selection
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className={labelClasses}>
                Selecionar Cliente <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={inputClasses}
                  placeholder="Buscar cliente por nome ou email..."
                />
                <div className="absolute right-0 top-0 bottom-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowNewClientModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#FFB800] hover:bg-[#E6A600] mt-6"
            >
              Novo Cliente
            </button>
          </div>

          {selectedClient && (
            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-700 dark:text-green-400">
                Cliente selecionado: <strong>{selectedClient.name}</strong>
              </p>
            </div>
          )}

          {/* Lista de Clientes Filtrada */}
          <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
            {filteredClients.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                Nenhum cliente encontrado com essa busca
              </p>
            ) : (
              filteredClients.map(client => (
                <div
                  key={client.id}
                  onClick={() => selectClient(client)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedClient?.id === client.id
                      ? 'border-[#FFB800] bg-[#FFF9E6] dark:bg-[#FFB800]/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#FFB800]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {client.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {client.email} • {client.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal de Novo Cliente */}
      {showNewClientModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70" 
                 onClick={() => setShowNewClientModal(false)} />
            
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Novo Cliente
                </h3>
                <button
                  onClick={() => setShowNewClientModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleNewClientSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Nome Completo</label>
                    <input
                      type="text"
                      className={inputClasses}
                      placeholder="Digite o nome completo"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Email</label>
                    <input
                      type="email"
                      className={inputClasses}
                      placeholder="Digite o email"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Telefone</label>
                    <input
                      type="tel"
                      className={inputClasses}
                      placeholder="Digite o telefone"
                      required
                    />
                  </div>
                  {/* Adicione os outros campos necessários */}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNewClientModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#FFB800] rounded-lg hover:bg-[#E6A600]"
                  >
                    Salvar Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}