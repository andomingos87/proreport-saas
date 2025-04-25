'use client'

import { useState, useEffect } from 'react'
import { X, Plus, FileText, Pencil, Copy, Trash } from 'lucide-react'
import type { FormData } from './types'
import { inputClasses, labelClasses } from './types'
import { CoverLetter, coverLettersService } from '@/services/cover-letters'
import { toast } from 'sonner'

type CoverLetterStepProps = {
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

export function CoverLetterStep({ formData, setFormData }: CoverLetterStepProps) {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false)
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<CoverLetter | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'duplicate'>('view')

  useEffect(() => {
    loadCoverLetters()
  }, [])

  const loadCoverLetters = async () => {
    try {
      setLoading(true)
      const data = await coverLettersService.list()
      setCoverLetters(data)
    } catch (error) {
      console.error('Erro ao carregar cartas:', error)
      toast.error('Falha ao carregar cartas de apresentação')
    } finally {
      setLoading(false)
    }
  }

  const handleCoverLetterAction = (coverLetter: CoverLetter, action: 'view' | 'edit' | 'duplicate') => {
    setSelectedCoverLetter(coverLetter)
    setModalMode(action)
    setShowCoverLetterModal(true)
  }

  const handleDeleteCoverLetter = async (coverLetter: CoverLetter) => {
    if (window.confirm('Tem certeza que deseja excluir esta carta?')) {
      try {
        const success = await coverLettersService.delete(coverLetter.id)
        if (success) {
          toast.success('Carta excluída com sucesso')
          loadCoverLetters()
        }
      } catch (error) {
        console.error('Erro ao excluir carta:', error)
        toast.error('Falha ao excluir carta')
      }
    }
  }

  const handleSaveCoverLetter = async (data: any) => {
    try {
      let result;
      if (modalMode === 'edit' && selectedCoverLetter) {
        result = await coverLettersService.update(selectedCoverLetter.id, data)
        if (result) toast.success('Carta atualizada com sucesso')
      } else if (modalMode === 'duplicate' && selectedCoverLetter) {
        result = await coverLettersService.duplicate(selectedCoverLetter.id, data.title)
        if (result) toast.success('Carta duplicada com sucesso')
      } else {
        result = await coverLettersService.create(data)
        if (result) toast.success('Carta criada com sucesso')
      }
      
      if (result) {
        loadCoverLetters()
        setShowCoverLetterModal(false)
      }
    } catch (error) {
      console.error('Erro ao salvar carta:', error)
      toast.error('Falha ao salvar carta')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB800]" />
      </div>
    )
  }

  if (coverLetters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            Nenhuma carta cadastrada
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Comece cadastrando uma nova carta de apresentação.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setSelectedCoverLetter(null)
                setModalMode('edit')
                setShowCoverLetterModal(true)
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#FFB800] hover:bg-[#E6A600]"
            >
              <Plus className="h-5 w-5 mr-2" />
              Criar Carta
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
              Buscar Carta
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
              setSelectedCoverLetter(null)
              setModalMode('edit')
              setShowCoverLetterModal(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#FFB800] hover:bg-[#E6A600] mt-6"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Carta
          </button>
        </div>

        {/* Lista de Cartas */}
        <div className="mt-4 space-y-2">
          {coverLetters
            .filter(coverLetter => 
              coverLetter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              coverLetter.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(coverLetter => (
              <div
                key={coverLetter.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.coverLetter.selectedCoverLetter === coverLetter.id
                    ? 'border-[#FFB800] bg-[#FFF9E6] dark:bg-[#FFB800]/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#FFB800]'
                }`}
                onClick={() => {
                  setSelectedCoverLetter(coverLetter)
                  setModalMode('view')
                  setShowCoverLetterModal(true)
                  setFormData({
                    ...formData,
                    coverLetter: { 
                      ...formData.coverLetter, 
                      selectedCoverLetter: coverLetter.id,
                      content: coverLetter.content
                    }
                  })
                }}
              >
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {coverLetter.title}
                  </h4>
                  {coverLetter.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {coverLetter.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal de Carta */}
      {showCoverLetterModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70" 
                 onClick={() => setShowCoverLetterModal(false)} />
            
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {modalMode === 'view' ? 'Visualizar Carta' : 
                   modalMode === 'edit' ? 'Editar Carta' : 
                   'Duplicar Carta'}
                </h3>
                <div className="flex items-center gap-2">
                  {selectedCoverLetter && modalMode === 'view' && (
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
                          handleDeleteCoverLetter(selectedCoverLetter)
                          setShowCoverLetterModal(false)
                        }}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowCoverLetterModal(false)}
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
                handleSaveCoverLetter(data)
              }}>
                <div className="space-y-4">
                  <div>
                    <label className={labelClasses}>Título</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={selectedCoverLetter?.title}
                      className={inputClasses}
                      placeholder="Digite o título da carta"
                      required
                      disabled={modalMode === 'view'}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Descrição</label>
                    <input
                      type="text"
                      name="description"
                      defaultValue={selectedCoverLetter?.description}
                      className={inputClasses}
                      placeholder="Digite uma descrição (opcional)"
                      disabled={modalMode === 'view'}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Conteúdo</label>
                    <textarea
                      name="content"
                      defaultValue={selectedCoverLetter?.content}
                      rows={15}
                      className={inputClasses}
                      placeholder="Digite o conteúdo da carta"
                      required
                      disabled={modalMode === 'view'}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCoverLetterModal(false)}
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
