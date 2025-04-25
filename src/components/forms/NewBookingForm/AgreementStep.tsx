'use client'

import { useState, useEffect } from 'react'
import { X, Plus, FileText, Pencil, Copy, Trash } from 'lucide-react'
import type { FormData } from './types'
import { inputClasses, labelClasses } from './types'
import { Contract, contractsService } from '@/services/contracts'
import { toast } from 'sonner'

type AgreementStepProps = {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

export function AgreementStep({ formData, setFormData }: AgreementStepProps) {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showContractModal, setShowContractModal] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'duplicate'>('view')

  useEffect(() => {
    loadContracts()
  }, [])

  const loadContracts = async () => {
    try {
      setLoading(true)
      const data = await contractsService.list()
      setContracts(data)
    } catch (error) {
      console.error('Erro ao carregar contratos:', error)
      toast.error('Falha ao carregar contratos')
    } finally {
      setLoading(false)
    }
  }

  const handleContractAction = (contract: Contract, action: 'view' | 'edit' | 'duplicate') => {
    setSelectedContract(contract)
    setModalMode(action)
    setShowContractModal(true)
  }

  const handleDeleteContract = async (contract: Contract) => {
    if (window.confirm('Tem certeza que deseja excluir este contrato?')) {
      try {
        await contractsService.delete(contract.id)
        toast.success('Contrato excluído com sucesso')
        loadContracts()
      } catch (error) {
        toast.error('Falha ao excluir contrato')
      }
    }
  }

  const handleSaveContract = async (data: any) => {
    try {
      if (modalMode === 'edit' && selectedContract) {
        await contractsService.update(selectedContract.id, data)
        toast.success('Contrato atualizado com sucesso')
      } else if (modalMode === 'duplicate' && selectedContract) {
        await contractsService.duplicate(selectedContract.id, data.title)
        toast.success('Contrato duplicado com sucesso')
      } else {
        await contractsService.create(data)
        toast.success('Contrato criado com sucesso')
      }
      loadContracts()
      setShowContractModal(false)
    } catch (error) {
      toast.error('Falha ao salvar contrato')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB800]" />
      </div>
    )
  }

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            Nenhum contrato cadastrado
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comece cadastrando um novo contrato para suas inspeções.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setSelectedContract(null)
                setModalMode('view')
                setShowContractModal(true)
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#FFB800] hover:bg-[#E6A600]"
            >
              <Plus className="h-5 w-5 mr-2" />
              Criar Contrato
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className={labelClasses}>
              Buscar Contrato
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={inputClasses}
                placeholder="Buscar por título ou conteúdo..."
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
            onClick={() => {
              setSelectedContract(null)
              setModalMode('view')
              setShowContractModal(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#FFB800] hover:bg-[#E6A600] mt-6"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Contrato
          </button>
        </div>

        {/* Lista de Contratos */}
        <div className="mt-4 space-y-2">
          {contracts
            .filter(contract => 
              contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              contract.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(contract => (
              <div
                key={contract.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.agreement.selectedContract === contract.id
                    ? 'border-[#FFB800] bg-[#FFF9E6] dark:bg-[#FFB800]/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#FFB800]'
                }`}
                onClick={() => {
                  setSelectedContract(contract)
                  setModalMode('view')
                  setShowContractModal(true)
                  setFormData({
                    ...formData,
                    agreement: { selectedContract: contract.id }
                  })
                }}
              >
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {contract.title}
                  </h4>
                  {contract.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {contract.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal de Contrato */}
      {showContractModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70" 
                 onClick={() => setShowContractModal(false)} />
            
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {modalMode === 'view' ? 'Visualizar Contrato' : 
                   modalMode === 'edit' ? 'Editar Contrato' : 
                   'Duplicar Contrato'}
                </h3>
                <div className="flex items-center gap-2">
                  {selectedContract && modalMode === 'view' && (
                    <>
                      <button
                        onClick={() => setModalMode('edit')}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setModalMode('duplicate')}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteContract(selectedContract)
                          setShowContractModal(false)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowContractModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const data = {
                  title: formData.get('title') as string,
                  content: formData.get('content') as string,
                  description: formData.get('description') as string,
                }
                handleSaveContract(data)
              }}>
                <div className="space-y-4">
                  <div>
                    <label className={labelClasses}>Título</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={selectedContract?.title}
                      className={inputClasses}
                      placeholder="Digite o título do contrato"
                      required
                      readOnly={modalMode === 'view'}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Descrição</label>
                    <input
                      type="text"
                      name="description"
                      defaultValue={selectedContract?.description}
                      className={inputClasses}
                      placeholder="Digite uma descrição (opcional)"
                      readOnly={modalMode === 'view'}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Conteúdo</label>
                    <textarea
                      name="content"
                      defaultValue={selectedContract?.content}
                      rows={15}
                      className={inputClasses}
                      placeholder="Digite o conteúdo do contrato"
                      required
                      readOnly={modalMode === 'view'}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowContractModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  {modalMode !== 'view' && (
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#FFB800] rounded-lg hover:bg-[#E6A600]"
                    >
                      {modalMode === 'edit' ? 'Salvar' : 'Duplicar'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
