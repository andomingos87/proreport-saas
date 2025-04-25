'use client'

import { useState, useEffect } from 'react'
import { 
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building,
  MoreVertical,
  Pencil,
  Trash2
} from 'lucide-react'
import { Table } from '@/components/shared/Table'
import { NewContactModal } from '@/components/forms/NewContactModal'
import { EditContactModal } from '@/components/forms/EditContactModal'
import { ContactDetailsModal } from '@/components/forms/ContactDetailsModal'
import { DeleteConfirmationModal } from '@/components/shared/DeleteConfirmationModal'
import { Contact, contactsService } from '@/services/contacts'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

const columns = [
  { key: 'name', label: 'Nome', sortable: true },
  { key: 'company', label: 'Empresa', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'phone', label: 'Telefone', sortable: true },
  { key: 'type', label: 'Tipo', sortable: true },
  { key: 'actions', label: 'Ações' },
]

export default function ContactsPage() {
  const { user, loading: authLoading } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false)
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  useEffect(() => {
    if (user) {
      loadContacts()
    }
  }, [user])

  useEffect(() => {
    filterContacts()
  }, [search, contacts])

  const loadContacts = async () => {
    try {
      const data = await contactsService.list()
      setContacts(data)
      setFilteredContacts(data)
    } catch (error: any) {
      console.error('Error loading contacts:', error)
      if (error.message === 'User not authenticated') {
        toast.error('Por favor, faça login para visualizar contatos')
      } else {
        toast.error('Falha ao carregar contatos')
      }
    } finally {
      setLoading(false)
    }
  }

  const filterContacts = () => {
    if (!search) {
      setFilteredContacts(contacts)
      return
    }

    const searchLower = search.toLowerCase()
    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchLower) ||
      (contact.company && contact.company.toLowerCase().includes(searchLower)) ||
      (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchLower))
    )
    setFilteredContacts(filtered)
  }

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(key)
      setSortDirection('asc')
    }

    const sorted = [...filteredContacts].sort((a: any, b: any) => {
      if (a[key] === null) return 1
      if (b[key] === null) return -1
      if (a[key] < b[key]) return sortDirection === 'asc' ? -1 : 1
      if (a[key] > b[key]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setFilteredContacts(sorted)
  }

  const handleNewContact = async (data: any) => {
    try {
      const newContact = await contactsService.create(data)
      setContacts(prev => [newContact, ...prev])
      setIsNewContactModalOpen(false)
      toast.success('Contato criado com sucesso')
    } catch (error: any) {
      console.error('Error creating contact:', error)
      if (error.message === 'User not authenticated') {
        toast.error('Por favor, faça login para criar contatos')
      } else {
        toast.error('Falha ao criar contato')
      }
    }
  }

  const handleEditContact = async (data: any) => {
    if (!selectedContact) return

    try {
      const updatedContact = await contactsService.update(selectedContact.id, data)
      setContacts(prev => prev.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      ))
      setIsEditContactModalOpen(false)
      setSelectedContact(null)
      toast.success('Contato atualizado com sucesso')
    } catch (error: any) {
      console.error('Error updating contact:', error)
      if (error.message === 'User not authenticated') {
        toast.error('Por favor, faça login para atualizar contatos')
      } else {
        toast.error('Falha ao atualizar contato')
      }
    }
  }

  const handleDeleteContact = async (contact: Contact) => {
    setContactToDelete(contact)
    setIsDeleteConfirmationOpen(true)
  }

  const confirmDelete = async () => {
    if (!contactToDelete) return

    try {
      await contactsService.delete(contactToDelete.id)
      setContacts(prev => prev.filter(c => c.id !== contactToDelete.id))
      toast.success('Contato excluído com sucesso')
    } catch (error: any) {
      console.error('Error deleting contact:', error)
      if (error.message === 'User not authenticated') {
        toast.error('Por favor, faça login para excluir contatos')
      } else {
        toast.error('Falha ao excluir contato')
      }
    } finally {
      setIsDeleteConfirmationOpen(false)
      setContactToDelete(null)
    }
  }

  const cancelDelete = () => {
    setIsDeleteConfirmationOpen(false)
    setContactToDelete(null)
  }

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact)
    setIsDetailsModalOpen(true)
  }

  const getTypeTag = (type: string) => {
    const colors = {
      client: 'blue',
      agent: 'purple',
      other: 'gray'
    }
    const color = colors[type as keyof typeof colors] || 'gray'
    
    const typeTranslations: {[key: string]: string} = {
      client: 'Cliente',
      agent: 'Agente',
      other: 'Outro'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium text-${color}-700 dark:text-${color}-400 bg-${color}-100 dark:bg-${color}-900/50 rounded-full`}>
        {typeTranslations[type] || type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  const tableData = filteredContacts.map(contact => ({
    ...contact,
    type: getTypeTag(contact.type),
    actions: (
      <div className="flex items-center gap-2">
        {contact.email && (
          <a 
            href={`mailto:${contact.email}`}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
        {contact.phone && (
          <a 
            href={`tel:${contact.phone}`}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setSelectedContact(contact);
            setIsEditContactModalOpen(true);
          }}
          className="p-1 text-gray-600 dark:text-gray-400 hover:text-[#FFB800] dark:hover:text-[#FFB800] transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteContact(contact);
          }}
          className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Contatos</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Gerencie seus contatos e suas informações.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Lista de Contatos
            </h3>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar contato..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full sm:w-64 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Filter className="w-4 h-4" />
                Filtros
              </button>

              <button
                onClick={() => setIsNewContactModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#FFB800] rounded-lg hover:bg-[#E6A600] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo Contato
              </button>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          data={tableData}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          loading={loading}
          onRowClick={handleViewDetails}
        />
      </div>

      <NewContactModal
        isOpen={isNewContactModalOpen}
        onClose={() => setIsNewContactModalOpen(false)}
        onSubmit={handleNewContact}
      />

      {selectedContact && (
        <>
          <EditContactModal
            isOpen={isEditContactModalOpen}
            onClose={() => {
              setIsEditContactModalOpen(false)
              setSelectedContact(null)
            }}
            onSubmit={handleEditContact}
            contact={selectedContact}
          />
          
          <ContactDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false)
              setSelectedContact(null)
            }}
            contact={selectedContact}
            onEdit={() => {
              setIsDetailsModalOpen(false)
              setIsEditContactModalOpen(true)
            }}
            onDelete={() => {
              setIsDetailsModalOpen(false)
              handleDeleteContact(selectedContact)
            }}
          />
        </>
      )}

      {isDeleteConfirmationOpen && (
        <DeleteConfirmationModal
        isOpen={isDeleteConfirmationOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={contactToDelete?.name}
        itemType="o contato"
      />
      )}
    </div>
  )
} 