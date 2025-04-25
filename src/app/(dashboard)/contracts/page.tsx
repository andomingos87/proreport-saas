'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Search,
  Filter,
  Plus,
  FileText,
  Tags,
  ListFilter,
  Grid,
  AlignLeft,
  Mail
} from 'lucide-react'
import { Contract, ContractStatus, contractsService } from '@/services/contracts'
import { ContractFormModal } from '@/components/forms/ContractFormModal'
import { ContractViewModal } from '@/components/forms/ContractViewModal'
import { ContractCard } from '@/components/forms/ContractCard'
import { ContractListItem } from '@/components/forms/ContractListItem'
import { DeleteConfirmationModal } from '@/components/shared/DeleteConfirmationModal'
import { ContractExportModal } from '@/components/forms/ContractExportModal'
import { toast } from 'sonner'

type ViewMode = 'grid' | 'list';

export default function ContractsPage() {
  // Estados para contratos
  const [contracts, setContracts] = useState<Contract[]>([])
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showTemplatesOnly, setShowTemplatesOnly] = useState(false)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeStatus, setActiveStatus] = useState<ContractStatus | null>(null)
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  
  // Estados para modais
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false)
  const [isEditContractModalOpen, setIsEditContractModalOpen] = useState(false)
  const [isViewContractModalOpen, setIsViewContractModalOpen] = useState(false)
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  
  // Estados para contrato selecionado
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null)

  // Refs para os dropdowns
  const tagDropdownRef = useRef<HTMLDivElement>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  
  // Carregar dados iniciais
  useEffect(() => {
    loadContracts()
  }, [])

  // Filtrar contratos quando a busca ou filtros mudam
  useEffect(() => {
    filterContracts()
  }, [search, showTemplatesOnly, activeTag, activeStatus, contracts])

  // Fechar dropdowns quando clicar fora deles
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isTagDropdownOpen && 
          tagDropdownRef.current && 
          !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false)
      }
      
      if (isStatusDropdownOpen && 
          statusDropdownRef.current && 
          !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isTagDropdownOpen, isStatusDropdownOpen])

  const loadContracts = async () => {
    try {
      setLoading(true)
      const data = await contractsService.list()
      setContracts(data)
      setFilteredContracts(data)
    } catch (error: any) {
      console.error('Error loading contracts:', error)
      if (error.message === 'User not authenticated') {
        toast.error('Por favor, faça login para visualizar contratos')
      } else {
        toast.error('Falha ao carregar contratos')
      }
    } finally {
      setLoading(false)
    }
  }

  const filterContracts = () => {
    let filtered = [...contracts]
    
    // Filtrar por termo de busca
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(contract => 
        contract.title.toLowerCase().includes(searchLower) ||
        (contract.description && contract.description.toLowerCase().includes(searchLower)) ||
        (contract.content && contract.content.toLowerCase().includes(searchLower))
      )
    }
    
    // Filtrar por templates
    if (showTemplatesOnly) {
      filtered = filtered.filter(contract => contract.is_template)
    }
    
    // Filtrar por tag
    if (activeTag) {
      filtered = filtered.filter(contract => 
        contract.tags && contract.tags.includes(activeTag)
      )
    }
    
    // Filtrar por status
    if (activeStatus) {
      filtered = filtered.filter(contract => contract.status === activeStatus)
    }
    
    setFilteredContracts(filtered)
  }

  // Listar todas as tags únicas
  const getAllTags = () => {
    const tagsSet = new Set<string>()
    contracts.forEach(contract => {
      if (contract.tags) {
        contract.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    return Array.from(tagsSet).sort()
  }

  // Handlers para modais
  const handleNewContract = () => {
    setSelectedContract(null)
    setIsNewContractModalOpen(true)
  }

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract)
    setIsViewContractModalOpen(true)
  }

  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract)
    setIsEditContractModalOpen(true)
  }

  const handleDeleteContract = (contract: Contract) => {
    setContractToDelete(contract)
    setIsDeleteConfirmationOpen(true)
  }

  const handleSendEmail = (contract: Contract) => {
    setSelectedContract(contract)
    setIsExportModalOpen(true)
  }

  const handleDuplicateContract = async (contract: Contract) => {
    try {
      const newContract = await contractsService.duplicate(contract.id)
      setContracts(prev => [newContract, ...prev])
      toast.success('Contrato duplicado com sucesso')
    } catch (error: any) {
      console.error('Error duplicating contract:', error)
      toast.error('Falha ao duplicar contrato')
    }
  }

  // Handlers para submissão de formulários
  const handleSubmitNewContract = async (data: any) => {
    try {
      const newContract = await contractsService.create(data)
      setContracts(prev => [newContract, ...prev])
      setIsNewContractModalOpen(false)
      toast.success('Contrato criado com sucesso')
    } catch (error: any) {
      console.error('Error creating contract:', error)
      toast.error('Falha ao criar contrato')
    }
  }

  const handleSubmitEditContract = async (data: any) => {
    if (!selectedContract) return

    try {
      const updatedContract = await contractsService.update(selectedContract.id, data)
      setContracts(prev => prev.map(contract => 
        contract.id === updatedContract.id ? updatedContract : contract
      ))
      setIsEditContractModalOpen(false)
      setSelectedContract(null)
      toast.success('Contrato atualizado com sucesso')
    } catch (error: any) {
      console.error('Error updating contract:', error)
      toast.error('Falha ao atualizar contrato')
    }
  }

  const handleUpdateContractStatus = async (contract: Contract, status: ContractStatus) => {
    try {
      const updatedContract = await contractsService.updateStatus(contract.id, status)
      setContracts(prev => prev.map(c => 
        c.id === updatedContract.id ? updatedContract : c
      ))
      toast.success(`Status do contrato alterado para ${contractsService.getStatusLabel(status)}`)
    } catch (error: any) {
      console.error('Error updating contract status:', error)
      toast.error('Falha ao atualizar status do contrato')
    }
  }

  const confirmDelete = async () => {
    if (!contractToDelete) return

    try {
      await contractsService.delete(contractToDelete.id)
      setContracts(prev => prev.filter(c => c.id !== contractToDelete.id))
      toast.success('Contrato excluído com sucesso')
    } catch (error: any) {
      console.error('Error deleting contract:', error)
      toast.error('Falha ao excluir contrato')
    } finally {
      setIsDeleteConfirmationOpen(false)
      setContractToDelete(null)
    }
  }

  const cancelDelete = () => {
    setIsDeleteConfirmationOpen(false)
    setContractToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Contratos</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Gerencie seus contratos e modelos de contrato.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Lista de Contratos
            </h3>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar contrato..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full sm:w-64 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'grid' 
                      ? 'bg-[#6C5DD3]/10 text-[#6C5DD3] dark:bg-[#6C5DD3]/20' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Visualização em Grade"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'list' 
                      ? 'bg-[#6C5DD3]/10 text-[#6C5DD3] dark:bg-[#6C5DD3]/20' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title="Visualização em Lista"
                >
                  <AlignLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowTemplatesOnly(!showTemplatesOnly)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg ${
                    showTemplatesOnly 
                      ? 'bg-[#6C5DD3]/10 text-[#6C5DD3] dark:bg-[#6C5DD3]/20' 
                      : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } transition-colors`}
                >
                  <FileText className="w-4 h-4" />
                  {showTemplatesOnly ? 'Todos' : 'Modelos'}
                </button>

                {/* Dropdown de filtro por status */}
                <div className="relative" ref={statusDropdownRef}>
                  <button
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg ${
                      activeStatus
                        ? 'bg-[#6C5DD3]/10 text-[#6C5DD3] dark:bg-[#6C5DD3]/20'
                        : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } transition-colors`}
                  >
                    <Filter className="w-4 h-4" />
                    {activeStatus ? contractsService.getStatusLabel(activeStatus) : 'Status'}
                  </button>
                  {isStatusDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 p-2">
                      <button
                        onClick={() => {
                          setActiveStatus(null);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1 text-sm rounded-md ${!activeStatus ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        Todos os status
                      </button>
                      {(['draft', 'sent', 'signed', 'expired'] as ContractStatus[]).map(status => (
                        <button
                          key={status}
                          onClick={() => {
                            setActiveStatus(status);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1 text-sm rounded-md flex items-center ${activeStatus === status ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-2 bg-${contractsService.getStatusColor(status)}-500`}></span>
                          {contractsService.getStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dropdown de filtro por tag */}
                <div className="relative tag-dropdown" ref={tagDropdownRef}>
                  <button
                    onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg ${
                      activeTag
                        ? 'bg-[#6C5DD3]/10 text-[#6C5DD3] dark:bg-[#6C5DD3]/20'
                        : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    } transition-colors`}
                  >
                    <Tags className="w-4 h-4" />
                    {activeTag || 'Tags'}
                  </button>
                  {isTagDropdownOpen && getAllTags().length > 0 && (
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 p-2">
                      <button
                        onClick={() => {
                          setActiveTag(null);
                          setIsTagDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1 text-sm rounded-md ${!activeTag ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        Todas as tags
                      </button>
                      {getAllTags().map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            setActiveTag(tag);
                            setIsTagDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1 text-sm rounded-md ${activeTag === tag ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNewContract}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6C5DD3] rounded-lg hover:bg-[#5B4EC7] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Novo Contrato
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-[#6C5DD3] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Carregando...</span>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando contratos...</p>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhum contrato encontrado</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {search || showTemplatesOnly || activeTag || activeStatus ? 'Tente ajustar seus filtros.' : 'Comece criando seu primeiro contrato.'}
            </p>
            {!search && !showTemplatesOnly && !activeTag && !activeStatus && (
              <div className="mt-6">
                <button
                  onClick={handleNewContract}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#6C5DD3] hover:bg-[#5B4EC7]"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Novo Contrato
                </button>
              </div>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContracts.map(contract => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onView={handleViewContract}
                onEdit={handleEditContract}
                onDelete={handleDeleteContract}
                onDuplicate={handleDuplicateContract}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 gap-4">
            {filteredContracts.map(contract => (
              <ContractListItem
                key={contract.id}
                contract={contract}
                onView={handleViewContract}
                onEdit={handleEditContract}
                onDelete={handleDeleteContract}
                onDuplicate={handleDuplicateContract}
                onSendEmail={handleSendEmail}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modais */}
      <ContractFormModal
        isOpen={isNewContractModalOpen}
        onClose={() => setIsNewContractModalOpen(false)}
        onSubmit={handleSubmitNewContract}
        title="Novo Contrato"
      />

      {selectedContract && (
        <>
          <ContractFormModal
            isOpen={isEditContractModalOpen}
            onClose={() => {
              setIsEditContractModalOpen(false)
              setSelectedContract(null)
            }}
            onSubmit={handleSubmitEditContract}
            initialData={selectedContract}
            title={`Editar: ${selectedContract.title}`}
          />
          
          <ContractViewModal
            isOpen={isViewContractModalOpen}
            onClose={() => {
              setIsViewContractModalOpen(false)
              setSelectedContract(null)
            }}
            contract={selectedContract}
            onEdit={handleEditContract}
            onSendEmail={handleSendEmail}
            onUpdateStatus={handleUpdateContractStatus}
          />
          
          <ContractExportModal
            isOpen={isExportModalOpen}
            onClose={() => {
              setIsExportModalOpen(false);
              setSelectedContract(null);
            }}
            contract={selectedContract}
          />
        </>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmationOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={contractToDelete?.title}
        itemType="o contrato"
      />
    </div>
  )
}