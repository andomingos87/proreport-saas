'use client'

import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { Contract, contractsService } from '@/services/contracts'
import { toast } from 'sonner'
import { inputClasses, textareaClasses } from '../types'

type ContractFormModalProps = {
  isOpen: boolean
  onClose: () => void
  contract?: Contract | null
  onSuccess: () => void
}

export function ContractFormModal({ 
  isOpen, 
  onClose, 
  contract, 
  onSuccess 
}: ContractFormModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')
  const [isTemplate, setIsTemplate] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [tagsInput, setTagsInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (contract) {
      setTitle(contract.title)
      setContent(contract.content)
      setDescription(contract.description || '')
      setIsTemplate(contract.is_template)
      setTags(contract.tags || [])
    } else {
      resetForm()
    }
  }, [contract])

  const resetForm = () => {
    setTitle('')
    setContent('')
    setDescription('')
    setIsTemplate(true)
    setTags([])
    setTagsInput('')
    setErrors({})
  }

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = 'Título é obrigatório'
    if (!content.trim()) newErrors.content = 'Conteúdo é obrigatório'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      if (contract) {
        await contractsService.update(contract.id, {
          title,
          content,
          description: description || undefined,
          is_template: isTemplate,
          tags: tags.length > 0 ? tags : undefined
        })
        toast.success('Contrato atualizado com sucesso')
      } else {
        await contractsService.create({
          title,
          content,
          description: description || undefined,
          is_template: isTemplate,
          tags: tags.length > 0 ? tags : undefined
        })
        toast.success('Contrato criado com sucesso')
      }
      onSuccess()
      onClose()
      resetForm()
    } catch (error) {
      console.error('Error saving contract:', error)
      toast.error(contract ? 'Falha ao atualizar contrato' : 'Falha ao criar contrato')
    }
  }

  const handleTagsInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagsInput.trim()
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag])
        setTagsInput('')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70" onClick={onClose} />
        
        <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {contract ? 'Editar Contrato' : 'Novo Contrato'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Nome do Contrato"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`${inputClasses} ${errors.title ? 'border-red-500' : ''}`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Descrição (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <textarea
                rows={12}
                placeholder="Digite o texto do contrato aqui..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`${textareaClasses} ${errors.content ? 'border-red-500' : ''}`}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Digite tags e pressione Enter"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={handleTagsInputKeyDown}
                className={inputClasses}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md"
                    >
                      {tag}
                      <button
                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={isTemplate}
                  onChange={(e) => setIsTemplate(e.target.checked)}
                  className="h-4 w-4 text-[#FFB800] focus:ring-[#FFB800] border-gray-300 rounded"
                />
                Salvar como modelo
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#FFB800] rounded-lg hover:bg-[#E6A600] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {contract ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
