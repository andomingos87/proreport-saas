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
import { CoverLetter, CoverLetterStatus, coverLettersService } from '@/services/cover-letters'
import { CoverLetterFormModal } from '@/components/forms/CoverLetterFormModal'
import { CoverLetterViewModal } from '@/components/forms/CoverLetterViewModal'
import { CoverLetterCard } from '@/components/forms/CoverLetterCard'
import { CoverLetterListItem } from '@/components/forms/CoverLetterListItem'
import { DeleteConfirmationModal } from '@/components/shared/DeleteConfirmationModal'
import { CoverLetterExportModal } from '@/components/forms/CoverLetterExportModal'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

type ViewMode = 'grid' | 'list';

export default function CoverLettersPage() {
  // Hook de autenticação
  const { loading: authLoading, user } = useAuth()
  
  // Estados para cartas de apresentação
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([])
  const [filteredCoverLetters, setFilteredCoverLetters] = useState<CoverLetter[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showTemplatesOnly, setShowTemplatesOnly] = useState(false)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeStatus, setActiveStatus] = useState<CoverLetterStatus | null>(null)
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  
  // Estados para modais
  const [isNewCoverLetterModalOpen, setIsNewCoverLetterModalOpen] = useState(false)
  const [isEditCoverLetterModalOpen, setIsEditCoverLetterModalOpen] = useState(false)
  const [isViewCoverLetterModalOpen, setIsViewCoverLetterModalOpen] = useState(false)
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  
  // Estados para carta selecionada
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<CoverLetter | null>(null)
  const [coverLetterToDelete, setCoverLetterToDelete] = useState<CoverLetter | null>(null)

  // Refs para os dropdowns
  const tagDropdownRef = useRef<HTMLDivElement>(null)
  const statusDropdownRef = useRef<HTMLDivElement>(null)
  
  // Carregar dados iniciais
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error('Por favor, faça login para visualizar cartas de apresentação')
        return
      }
      loadCoverLetters()
    }
  }, [authLoading, user])

  // Filtrar cartas quando a busca ou filtros mudam
  useEffect(() => {
    filterCoverLetters()
  }, [search, showTemplatesOnly, activeTag, activeStatus, coverLetters])

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

  const loadCoverLetters = async () => {
    try {
      setLoading(true)
      const data = await coverLettersService.list()
      // Garantir que apenas dados válidos sejam armazenados
      const validData = data.filter((item): item is CoverLetter => Boolean(item?.id))
      setCoverLetters(validData)
      setFilteredCoverLetters(validData)
    } catch (error: any) {
      console.error('Error loading cover letters:', error)
      if (error.message === 'User not authenticated') {
        toast.error('Por favor, faça login para visualizar cartas de apresentação')
      } else {
        toast.error('Falha ao carregar cartas de apresentação')
      }
    } finally {
      setLoading(false)
    }
  }

  const filterCoverLetters = () => {
    let filtered = [...coverLetters].filter((item): item is CoverLetter => Boolean(item?.id))
    
    // Filtrar por termo de busca
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(coverLetter => 
        coverLetter.title.toLowerCase().includes(searchLower) ||
        (coverLetter.description && coverLetter.description.toLowerCase().includes(searchLower)) ||
        (coverLetter.content && coverLetter.content.toLowerCase().includes(searchLower))
      )
    }
    
    // Filtrar por templates
    if (showTemplatesOnly) {
      filtered = filtered.filter(coverLetter => coverLetter.is_template)
    }
    
    // Filtrar por tag
    if (activeTag) {
      filtered = filtered.filter(coverLetter => 
        coverLetter.tags && coverLetter.tags.includes(activeTag)
      )
    }
    
    // Filtrar por status
    if (activeStatus) {
      filtered = filtered.filter(coverLetter => coverLetter.status === activeStatus)
    }
    
    setFilteredCoverLetters(filtered)
  }

  // Listar todas as tags únicas
  const getAllTags = () => {
    const tagsSet = new Set<string>()
    coverLetters
      .filter((item): item is CoverLetter => Boolean(item?.id))
      .forEach(coverLetter => {
        if (coverLetter.tags) {
          coverLetter.tags.forEach(tag => tagsSet.add(tag))
        }
      })
    return Array.from(tagsSet).sort()
  }

  // Handlers para modais
  const handleNewCoverLetter = () => {
    setSelectedCoverLetter(null)
    setIsNewCoverLetterModalOpen(true)
  }

  const handleViewCoverLetter = (coverLetter: CoverLetter) => {
    setSelectedCoverLetter(coverLetter)
    setIsViewCoverLetterModalOpen(true)
  }

  const handleEditCoverLetter = (coverLetter: CoverLetter) => {
    setSelectedCoverLetter(coverLetter)
    setIsEditCoverLetterModalOpen(true)
  }

  const handleDeleteCoverLetter = (coverLetter: CoverLetter) => {
    if (!coverLetter?.id) return
    setCoverLetterToDelete(coverLetter)
    setIsDeleteConfirmationOpen(true)
  }

  const handleSendEmail = (coverLetter: CoverLetter) => {
    setSelectedCoverLetter(coverLetter)
    setIsExportModalOpen(true)
  }

  const handleDuplicateCoverLetter = async (coverLetter: CoverLetter) => {
    if (!coverLetter?.id) return

    try {
      const newCoverLetter = await coverLettersService.duplicate(coverLetter.id)
      if (newCoverLetter?.id) {
        setCoverLetters(prev => [newCoverLetter, ...prev])
        toast.success('Carta de apresentação duplicada com sucesso')
      } else {
        toast.error('Erro ao duplicar carta: dados inválidos')
      }
    } catch (error: any) {
      console.error('Error duplicating cover letter:', error)
      toast.error('Falha ao duplicar carta de apresentação')
    }
  }

  // Handlers para submissão de formulários
  const handleSubmitNewCoverLetter = async (data: any) => {
    try {
      const newCoverLetter = await coverLettersService.create(data)
      if (newCoverLetter?.id) {
        setCoverLetters(prev => [newCoverLetter, ...prev])
        setIsNewCoverLetterModalOpen(false)
        toast.success('Carta de apresentação criada com sucesso')
      } else {
        toast.error('Erro ao criar carta: dados inválidos')
      }
    } catch (error: any) {
      console.error('Error creating cover letter:', error)
      toast.error('Falha ao criar carta de apresentação')
    }
  }

  const handleSubmitEditCoverLetter = async (data: any) => {
    if (!selectedCoverLetter?.id) return

    try {
      const updatedCoverLetter = await coverLettersService.update(selectedCoverLetter.id, data)
      if (updatedCoverLetter?.id) {
        setCoverLetters(prev => prev.map(coverLetter => 
          coverLetter.id === updatedCoverLetter.id ? updatedCoverLetter : coverLetter
        ))
        setIsEditCoverLetterModalOpen(false)
        setSelectedCoverLetter(null)
        toast.success('Carta de apresentação atualizada com sucesso')
      } else {
        toast.error('Erro ao atualizar carta: dados inválidos')
      }
    } catch (error: any) {
      console.error('Error updating cover letter:', error)
      toast.error('Falha ao atualizar carta de apresentação')
    }
  }

  const handleUpdateCoverLetterStatus = async (coverLetter: CoverLetter, status: CoverLetterStatus) => {
    if (!coverLetter?.id) return

    try {
      const updatedCoverLetter = await coverLettersService.updateStatus(coverLetter.id, status)
      if (updatedCoverLetter?.id) {
        setCoverLetters(prev => prev.map(c => 
          c.id === updatedCoverLetter.id ? updatedCoverLetter : c
        ))
        toast.success(`Status da carta alterado para ${coverLettersService.getStatusLabel(status)}`)
      } else {
        toast.error('Erro ao atualizar status da carta: dados inválidos')
      }
    } catch (error: any) {
      console.error('Error updating cover letter status:', error)
      toast.error('Falha ao atualizar status da carta')
    }
  }

  const confirmDelete = async () => {
    if (!coverLetterToDelete?.id) return

    try {
      const success = await coverLettersService.delete(coverLetterToDelete.id)
      if (success) {
        setCoverLetters(prev => prev.filter(c => c.id !== coverLetterToDelete.id))
        toast.success('Carta de apresentação excluída com sucesso')
      } else {
        toast.error('Erro ao excluir carta')
      }
    } catch (error: any) {
      console.error('Error deleting cover letter:', error)
      toast.error('Falha ao excluir carta de apresentação')
    } finally {
      setIsDeleteConfirmationOpen(false)
      setCoverLetterToDelete(null)
    }
  }

  const cancelDelete = () => {
    setIsDeleteConfirmationOpen(false)
    setCoverLetterToDelete(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Cartas de Apresentação</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Gerencie suas cartas de apresentação e modelos.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Lista de Cartas
            </h3>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar carta..."
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
                  {showTemplatesOnly ? 'Todas' : 'Modelos'}
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
                    {activeStatus ? coverLettersService.getStatusLabel(activeStatus) : 'Status'}
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
                      {(['draft', 'sent', 'approved', 'rejected'] as CoverLetterStatus[]).map(status => (
                        <button
                          key={status}
                          onClick={() => {
                            setActiveStatus(status);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1 text-sm rounded-md flex items-center ${activeStatus === status ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                          <span className={`w-2 h-2 rounded-full mr-2 bg-${coverLettersService.getStatusColor(status)}-500`}></span>
                          {coverLettersService.getStatusLabel(status)}
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
                  onClick={handleNewCoverLetter}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6C5DD3] rounded-lg hover:bg-[#5B4EC7] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nova Carta
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
            <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando cartas...</p>
          </div>
        ) : filteredCoverLetters.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma carta encontrada</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {search || showTemplatesOnly || activeTag || activeStatus ? 'Tente ajustar seus filtros.' : 'Comece criando sua primeira carta de apresentação.'}
            </p>
            {!search && !showTemplatesOnly && !activeTag && !activeStatus && (
              <div className="mt-6">
                <button
                  onClick={handleNewCoverLetter}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#6C5DD3] hover:bg-[#5B4EC7]"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Nova Carta
                </button>
              </div>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCoverLetters
              .filter((item): item is CoverLetter => Boolean(item?.id))
              .map(coverLetter => (
                <CoverLetterCard
                  key={coverLetter.id}
                  coverLetter={coverLetter}
                  onView={handleViewCoverLetter}
                  onEdit={handleEditCoverLetter}
                  onDelete={handleDeleteCoverLetter}
                  onDuplicate={handleDuplicateCoverLetter}
                />
              ))}
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 gap-4">
            {filteredCoverLetters
              .filter((item): item is CoverLetter => Boolean(item?.id))
              .map(coverLetter => (
                <CoverLetterListItem
                  key={coverLetter.id}
                  coverLetter={coverLetter}
                  onView={handleViewCoverLetter}
                  onEdit={handleEditCoverLetter}
                  onDelete={handleDeleteCoverLetter}
                  onDuplicate={handleDuplicateCoverLetter}
                  onSendEmail={handleSendEmail}
                />
              ))}
          </div>
        )}
      </div>

      {/* Modais */}
      <CoverLetterFormModal
        isOpen={isNewCoverLetterModalOpen}
        onClose={() => setIsNewCoverLetterModalOpen(false)}
        onSubmit={handleSubmitNewCoverLetter}
        title="Nova Carta"
      />

      {selectedCoverLetter?.id && (
        <>
          <CoverLetterFormModal
            isOpen={isEditCoverLetterModalOpen}
            onClose={() => {
              setIsEditCoverLetterModalOpen(false)
              setSelectedCoverLetter(null)
            }}
            onSubmit={handleSubmitEditCoverLetter}
            initialData={selectedCoverLetter}
            title={`Editar: ${selectedCoverLetter.title}`}
          />
          
          <CoverLetterViewModal
            isOpen={isViewCoverLetterModalOpen}
            onClose={() => {
              setIsViewCoverLetterModalOpen(false)
              setSelectedCoverLetter(null)
            }}
            coverLetter={selectedCoverLetter}
            onEdit={handleEditCoverLetter}
            onSendEmail={handleSendEmail}
            onUpdateStatus={handleUpdateCoverLetterStatus}
            onDuplicate={handleDuplicateCoverLetter}
          />
          
          <CoverLetterExportModal
            isOpen={isExportModalOpen}
            onClose={() => {
              setIsExportModalOpen(false)
              setSelectedCoverLetter(null)
            }}
            coverLetter={selectedCoverLetter}
          />
        </>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmationOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={coverLetterToDelete?.title}
        itemType="a carta"
      />
    </div>
  )
} 