import { useState, useEffect } from 'react'
import { X, Phone, Mail, MessageSquare, Building, ClipboardList, ExternalLink, Pencil, Trash2, Plus, User, Home, Calendar } from 'lucide-react'
import { Contact } from '@/services/contacts'
import { Property } from '@/services/properties'
import { propertiesService } from '@/services/properties'
import { Task, TaskStatus } from '@/services/tasks'
import { tasksService } from '@/services/tasks'
import { PropertyCard } from './PropertyCard'
import { PropertyForm } from './PropertyForm'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import { DeleteConfirmationModal } from '@/components/shared/DeleteConfirmationModal'

interface ContactDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact
  onEdit: () => void
  onDelete: () => void
}

type TabType = 'detalhes' | 'propriedades' | 'tarefas';

export function ContactDetailsModal({ isOpen, onClose, contact, onEdit, onDelete }: ContactDetailsModalProps) {
  // Estado para gerenciar as abas
  const [activeTab, setActiveTab] = useState<TabType>('detalhes');
  
  // Estados para propriedades
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoadingProperties, setIsLoadingProperties] = useState(false)
  const [propertyFormOpen, setPropertyFormOpen] = useState(false)
  const [currentProperty, setCurrentProperty] = useState<Property | undefined>(undefined)
  const [propertyError, setPropertyError] = useState<string | null>(null)
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null)
  const [isDeletePropertyModalOpen, setIsDeletePropertyModalOpen] = useState(false)

  // Estados para tarefas
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined)
  const [taskError, setTaskError] = useState<string | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false)

  // Carrega dados quando o modal abre
  useEffect(() => {
    if (isOpen && contact.id) {
      // Carrega dados de todas as abas para ter contagens disponíveis
      loadProperties()
      loadTasks()
    }
  }, [isOpen, contact.id])

  // Quando o usuário muda de aba, carrega os dados se necessário
  useEffect(() => {
    if (activeTab === 'propriedades' && properties.length === 0 && !isLoadingProperties && !propertyError) {
      loadProperties();
    } else if (activeTab === 'tarefas' && tasks.length === 0 && !isLoadingTasks && !taskError) {
      loadTasks();
    }
  }, [activeTab]);

  // Funções para gerenciar propriedades
  const loadProperties = async () => {
    try {
      setIsLoadingProperties(true)
      setPropertyError(null)
      const data = await propertiesService.listByContact(contact.id)
      setProperties(data)
    } catch (err) {
      console.error('Erro ao carregar propriedades:', err)
      setPropertyError('Não foi possível carregar as propriedades deste contato.')
    } finally {
      setIsLoadingProperties(false)
    }
  }

  const handleAddProperty = () => {
    setCurrentProperty(undefined)
    setPropertyFormOpen(true)
  }

  const handleEditProperty = (property: Property) => {
    setCurrentProperty(property)
    setPropertyFormOpen(true)
  }

  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property)
    setIsDeletePropertyModalOpen(true)
  }

  const confirmDeleteProperty = async () => {
    if (!propertyToDelete) return

    try {
      await propertiesService.delete(propertyToDelete.id)
      setProperties(properties.filter(p => p.id !== propertyToDelete.id))
    } catch (err) {
      console.error('Erro ao excluir propriedade:', err)
      alert('Não foi possível excluir a propriedade.')
    } finally {
      setIsDeletePropertyModalOpen(false)
      setPropertyToDelete(null)
    }
  }

  const cancelDeleteProperty = () => {
    setIsDeletePropertyModalOpen(false)
    setPropertyToDelete(null)
  }

  const handleSubmitProperty = async (data: any) => {
    try {
      if (currentProperty) {
        await propertiesService.update(currentProperty.id, data)
      } else {
        await propertiesService.create(data)
      }
      loadProperties()
    } catch (err) {
      console.error('Erro ao salvar propriedade:', err)
      throw err
    }
  }

  // Funções para gerenciar tarefas
  const loadTasks = async () => {
    try {
      setIsLoadingTasks(true)
      setTaskError(null)
      const data = await tasksService.listByContact(contact.id)
      setTasks(data)
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err)
      setTaskError('Não foi possível carregar as tarefas deste contato.')
    } finally {
      setIsLoadingTasks(false)
    }
  }

  const handleAddTask = () => {
    setCurrentTask(undefined)
    setTaskFormOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setCurrentTask(task)
    setTaskFormOpen(true)
  }

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task)
    setIsDeleteTaskModalOpen(true)
  }

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return

    try {
      await tasksService.delete(taskToDelete.id)
      setTasks(tasks.filter(t => t.id !== taskToDelete.id))
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err)
      alert('Não foi possível excluir a tarefa.')
    } finally {
      setIsDeleteTaskModalOpen(false)
      setTaskToDelete(null)
    }
  }

  const cancelDeleteTask = () => {
    setIsDeleteTaskModalOpen(false)
    setTaskToDelete(null)
  }

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    try {
      await tasksService.updateStatus(task.id, status)
      // Atualiza a lista de tarefas
      const updatedTasks = tasks.map(t => 
        t.id === task.id ? { ...t, status } : t
      )
      setTasks(updatedTasks)
    } catch (err) {
      console.error('Erro ao atualizar status da tarefa:', err)
      alert('Não foi possível atualizar o status da tarefa.')
    }
  }

  const handleSubmitTask = async (data: any) => {
    try {
      if (currentTask) {
        await tasksService.update(currentTask.id, data)
      } else {
        await tasksService.create(data)
      }
      loadTasks()
    } catch (err) {
      console.error('Erro ao salvar tarefa:', err)
      throw err
    }
  }

  // Alterna entre as abas
  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
  };

  if (!isOpen) return null

  const getTypeLabel = (type: string) => {
    const types = {
      client: 'Cliente',
      agent: 'Agente',
      other: 'Outro'
    }
    return types[type as keyof typeof types] || type
  }

  const getTypeColor = (type: string) => {
    const colors = {
      client: 'blue',
      agent: 'purple',
      other: 'gray'
    }
    const color = colors[type as keyof typeof colors] || 'gray'
    return `bg-${color}-100 text-${color}-700 dark:bg-${color}-900/50 dark:text-${color}-400`
  }

  // Formata o número para WhatsApp (remove caracteres não numéricos)
  const formatWhatsAppNumber = (phone: string) => {
    let formatted = phone.replace(/\D/g, '');
    // Se não começar com +, adiciona o código do Brasil
    if (!phone.includes('+')) {
      // Se o número já começar com 55, não adiciona novamente
      if (!formatted.startsWith('55')) {
        formatted = `55${formatted}`;
      }
    }
    return formatted;
  };

  // Verifica se existe alguma informação de endereço
  const hasAddressInfo = contact.address || contact.city || contact.province || contact.zipCode || contact.country;

  // Renderização dos botões de ação
  const renderActionButtons = () => (
    <div className="w-full space-y-3 mt-6">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Ações</h4>
      
      {contact.phone && (
        <>
          <a
            href={`tel:${contact.phone.replace(/\D/g, '')}`}
            className="flex items-center gap-2 p-3 w-full rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <Phone className="w-5 h-5 text-green-600" />
            <span>Ligar</span>
          </a>

          <a
            href={`https://wa.me/${formatWhatsAppNumber(contact.phone)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 w-full rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-green-600" />
            <span>WhatsApp</span>
            <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
          </a>
        </>
      )}

      {contact.email && (
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-2 p-3 w-full rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <Mail className="w-5 h-5 text-blue-600" />
          <span>Enviar e-mail</span>
        </a>
      )}

      <button
        onClick={handleAddProperty}
        className="flex items-center gap-2 p-3 w-full rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
      >
        <Building className="w-5 h-5 text-purple-600" />
        <span>Adicionar propriedade</span>
      </button>

      <button
        onClick={handleAddTask}
        className="flex items-center gap-2 p-3 w-full rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
      >
        <ClipboardList className="w-5 h-5 text-[#FFB800]" />
        <span>Adicionar tarefa</span>
      </button>

      <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 p-2 flex-1 justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <Pencil className="w-4 h-4" />
          <span>Editar</span>
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 p-2 flex-1 justify-center rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Excluir</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Cabeçalho com título e botão de fechar */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {contact.name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(contact.type)}`}>
                {getTypeLabel(contact.type)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navegação entre abas */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button 
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'detalhes' 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => changeTab('detalhes')}
            >
              <User className="w-4 h-4" />
              Detalhes
            </button>
            
            <button 
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'propriedades' 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => changeTab('propriedades')}
            >
              <Home className="w-4 h-4" />
              Propriedades
              {properties.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {properties.length}
                </span>
              )}
            </button>
            
            <button 
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'tarefas' 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => changeTab('tarefas')}
            >
              <Calendar className="w-4 h-4" />
              Tarefas
              {tasks.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {tasks.length}
                </span>
              )}
            </button>
          </div>

          {/* Conteúdo da aba selecionada */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Aba de Detalhes */}
            {activeTab === 'detalhes' && (
              <div className="flex flex-col md:flex-row gap-6">
                {/* Coluna da esquerda - Informações do contato */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {contact.company && (
                          <span className="font-medium">{contact.company}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {contact.email && (
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{contact.email}</span>
                      </div>
                    )}

                    {contact.phone && (
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{contact.phone}</span>
                      </div>
                    )}

                    {hasAddressInfo ? (
                      <div className="flex items-start">
                        <Building className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
                        <div>
                          {contact.address && <div className="text-gray-600 dark:text-gray-300">{contact.address}</div>}
                          {(contact.city || contact.province) && (
                            <div className="text-gray-600 dark:text-gray-300">
                              {[contact.city, contact.province].filter(Boolean).join(', ')}
                            </div>
                          )}
                          {(contact.zipCode || contact.country) && (
                            <div className="text-gray-600 dark:text-gray-300">
                              {[contact.zipCode, contact.country].filter(Boolean).join(' - ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Building className="w-5 h-5 mr-2" />
                        <span className="italic">Nenhum endereço cadastrado</span>
                      </div>
                    )}
                  </div>

                  {contact.notes ? (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações</h4>
                      <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        {contact.notes}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações</h4>
                      <p className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg italic">
                        Nenhuma observação
                      </p>
                    </div>
                  )}
                </div>

                {/* Coluna da direita - Ações */}
                <div className="md:w-64">
                  {renderActionButtons()}
                </div>
              </div>
            )}

            {/* Aba de Propriedades */}
            {activeTab === 'propriedades' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Propriedades</h4>
                  <button
                    onClick={handleAddProperty}
                    className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>
                
                {isLoadingProperties ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Carregando propriedades...
                  </div>
                ) : propertyError ? (
                  <div className="text-center py-8 text-red-500 dark:text-red-400">
                    {propertyError}
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
                    <Building className="h-12 w-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                    <p>Este contato não possui propriedades cadastradas.</p>
                    <button
                      onClick={handleAddProperty}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      Adicionar propriedade
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onEdit={handleEditProperty}
                        onDelete={handleDeleteProperty}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Aba de Tarefas */}
            {activeTab === 'tarefas' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Tarefas</h4>
                  <button
                    onClick={handleAddTask}
                    className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>
                
                {isLoadingTasks ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Carregando tarefas...
                  </div>
                ) : taskError ? (
                  <div className="text-center py-8 text-red-500 dark:text-red-400">
                    {taskError}
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
                    <ClipboardList className="h-12 w-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                    <p>Este contato não possui tarefas cadastradas.</p>
                    <button
                      onClick={handleAddTask}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      Adicionar tarefa
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {propertyFormOpen && (
        <PropertyForm
          isOpen={propertyFormOpen}
          onClose={() => setPropertyFormOpen(false)}
          onSubmit={handleSubmitProperty}
          initialData={currentProperty}
          contactId={contact.id}
          title={currentProperty ? `Editar ${currentProperty.name}` : 'Nova Propriedade'}
        />
      )}

      {taskFormOpen && (
        <TaskForm
          isOpen={taskFormOpen}
          onClose={() => setTaskFormOpen(false)}
          onSubmit={handleSubmitTask}
          initialData={currentTask}
          contactId={contact.id}
          title={currentTask ? `Editar ${currentTask.title}` : 'Nova Tarefa'}
        />
      )}

      {/* Modal de confirmação para exclusão de propriedades */}
      <DeleteConfirmationModal
        isOpen={isDeletePropertyModalOpen}
        onClose={cancelDeleteProperty}
        onConfirm={confirmDeleteProperty}
        itemName={propertyToDelete?.name}
        itemType="a propriedade"
      />

      {/* Modal de confirmação para exclusão de tarefas */}
      <DeleteConfirmationModal
        isOpen={isDeleteTaskModalOpen}
        onClose={cancelDeleteTask}
        onConfirm={confirmDeleteTask}
        itemName={taskToDelete?.title}
        itemType="a tarefa"
      />
    </>
  )
}