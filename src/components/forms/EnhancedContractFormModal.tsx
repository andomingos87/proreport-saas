import { useState, useEffect } from 'react'
import { X, Calendar, Clock, Users, Building, Tag, Save, File } from 'lucide-react'
import { Contract, ContractStatus } from '@/services/contracts'

interface EnhancedContractFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  initialData?: Contract
  title?: string
}

export function EnhancedContractFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  title = 'Novo Contrato'
}: EnhancedContractFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'content' | 'settings'>('details')
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    description: '',
    content: '',
    startDate: '',
    endDate: '',
    status: 'draft' as ContractStatus,
    tags: [] as string[],
    templateId: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Templates mockados para seleção
  const templates = [
    { id: 'residential', name: 'Contrato Residencial', description: 'Template padrão para inspeções residenciais' },
    { id: 'commercial', name: 'Contrato Comercial', description: 'Template para inspeções de propriedades comerciais' },
    { id: 'condo', name: 'Contrato de Condomínio', description: 'Template específico para condomínios' }
  ]

  // Opções de status
  const statusOptions = [
    { value: 'draft', label: 'Rascunho' },
    { value: 'pending', label: 'Pendente' },
    { value: 'active', label: 'Ativo' },
    { value: 'expired', label: 'Expirado' },
    { value: 'cancelled', label: 'Cancelado' }
  ]

  // Tags disponíveis
  const availableTags = [
    'Residencial', 'Comercial', 'Condomínio', 'Novo', 'Renovação', 'Prioritário'
  ]

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        client: initialData.client || '',
        description: initialData.description || '',
        content: initialData.content || '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        status: initialData.status || 'draft',
        tags: initialData.tags || [],
        templateId: initialData.templateId || ''
      })
    } else {
      // Resetar para os valores iniciais
      setFormData({
        title: '',
        client: '',
        description: '',
        content: '',
        startDate: '',
        endDate: '',
        status: 'draft',
        tags: [],
        templateId: ''
      })
    }
  }, [initialData, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório'
    }

    if (!formData.client.trim()) {
      newErrors.client = 'Cliente é obrigatório'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória'
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate).getTime()
      const end = new Date(formData.endDate).getTime()
      if (end < start) {
        newErrors.endDate = 'Data de término deve ser posterior à data de início'
      }
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

      const dataToSubmit = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
      }

      await onSubmit(dataToSubmit)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar contrato:', error)
      alert('Ocorreu um erro ao salvar o contrato.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectTemplate = (templateId: string) => {
    setFormData({
      ...formData,
      templateId,
      // Aqui você poderia preencher o conteúdo do contrato com base no template selecionado
      content: `Conteúdo do template ${templateId}. Aqui vem o texto padrão do contrato...`
    })
  }

  const toggleTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: formData.tags.filter(t => t !== tag)
      })
    } else {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
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

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
              activeTab === 'details'
                ? 'border-b-2 border-[#6C5DD3] text-[#6C5DD3]'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <File className="w-4 h-4" />
            Detalhes
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
              activeTab === 'content'
                ? 'border-b-2 border-[#6C5DD3] text-[#6C5DD3]'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <File className="w-4 h-4" />
            Conteúdo
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium ${
              activeTab === 'settings'
                ? 'border-b-2 border-[#6C5DD3] text-[#6C5DD3]'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <File className="w-4 h-4" />
            Configurações
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título do Contrato*
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Título do contrato"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cliente*
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className={`w-full p-2 border ${errors.client ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Nome do cliente"
                  />
                  {errors.client && (
                    <p className="mt-1 text-sm text-red-500">{errors.client}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Descrição breve do contrato"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Data de Início*
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={`w-full p-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Data de Término
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className={`w-full p-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ContractStatus })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 text-sm rounded-full border ${
                          formData.tags.includes(tag)
                            ? 'bg-[#6C5DD3] text-white border-[#6C5DD3]'
                            : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Selecionar Template
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {templates.map(template => (
                      <div
                        key={template.id}
                        onClick={() => handleSelectTemplate(template.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          formData.templateId === template.id
                            ? 'border-[#6C5DD3] bg-[#6C5DD3]/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-[#6C5DD3]'
                        }`}
                      >
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {template.name}
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {template.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Conteúdo do Contrato
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={15}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    placeholder="Digite o conteúdo do contrato aqui..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg">
                  <h4 className="text-sm font-semibold">Configurações avançadas</h4>
                  <p className="text-sm mt-1">
                    Aqui você pode configurar opções adicionais para este contrato, como permissões, notificações e integrações.
                  </p>
                </div>

                {/* Configurações adicionais poderiam ser adicionadas aqui */}
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-[#6C5DD3] rounded border-gray-300 focus:ring-[#6C5DD3]"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Enviar notificação por email ao cliente
                      </span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-[#6C5DD3] rounded border-gray-300 focus:ring-[#6C5DD3]"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Exigir assinatura digital
                      </span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-[#6C5DD3] rounded border-gray-300 focus:ring-[#6C5DD3]"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Adicionar marca d'água
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#6C5DD3] rounded-lg hover:bg-[#5B4EC7] disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}