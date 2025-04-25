import { useState, useEffect } from 'react'
import { X, Save, Tag, Info } from 'lucide-react'
import { Contract } from '@/services/contracts'

interface ContractFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: Contract
  title?: string
}

export function ContractFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  title = 'Novo Contrato'
}: ContractFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contractTitle, setContractTitle] = useState('')
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [isTemplate, setIsTemplate] = useState(false)
  const [tagsInput, setTagsInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setContractTitle(initialData.title || '')
      setContent(initialData.content || '')
      setDescription(initialData.description || '')
      setIsTemplate(initialData.is_template || false)
      setTags(initialData.tags || [])
      setTagsInput('')
    } else {
      // Valores padrão para novo registro
      setContractTitle('')
      setContent('')
      setDescription('')
      setIsTemplate(false)
      setTags([])
      setTagsInput('')
    }
  }, [initialData, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!contractTitle.trim()) {
      newErrors.title = 'Título é obrigatório'
    }

    if (!content.trim()) {
      newErrors.content = 'Conteúdo é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)

      const formData = {
        title: contractTitle,
        content,
        description: description || undefined,
        is_template: isTemplate,
        tags: tags.length > 0 ? tags : undefined
      }

      await onSubmit(formData)
      // Não fechamos o modal aqui para permitir que o componente pai decida quando fechar
    } catch (error) {
      console.error('Erro ao salvar contrato:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    if (tagsInput.trim() && !tags.includes(tagsInput.trim())) {
      setTags([...tags, tagsInput.trim()])
      setTagsInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTag()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={contractTitle}
                      onChange={(e) => setContractTitle(e.target.value)}
                      className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Título do contrato"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descrição
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Descrição breve do contrato"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isTemplate"
                    checked={isTemplate}
                    onChange={(e) => setIsTemplate(e.target.checked)}
                    className="h-4 w-4 text-[#6C5DD3] focus:ring-[#6C5DD3] border-gray-300 rounded"
                  />
                  <label htmlFor="isTemplate" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Salvar como modelo
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Tags
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Adicionar tag"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 border-l-0 rounded-r-md text-gray-700 dark:text-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300"
                      >
                        {tag}
                        <button 
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-600 dark:text-blue-300">
                      <p className="font-medium">Dica:</p>
                      <p className="mt-1">Use <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">{'{{variavel}}'}</code> para adicionar campos dinâmicos que serão preenchidos automaticamente.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Conteúdo do Contrato *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`w-full p-2 border ${errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono`}
                placeholder="Digite o texto do contrato aqui..."
                rows={15}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6C5DD3] rounded-lg hover:bg-[#5B4EC7] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Criar Contrato'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}