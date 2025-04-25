import { Contract } from '@/services/contracts'
import { Download, FileText, Send, MoreVertical, Calendar, Building, Tag } from 'lucide-react'
import { useState } from 'react'

interface ContractListItemProps {
  contract: Contract
  onView: (contract: Contract) => void
  onEdit: (contract: Contract) => void
  onDelete: (contract: Contract) => void
  onDuplicate: (contract: Contract) => Promise<void>
  onSendEmail: (contract: Contract) => void
}

export function ContractListItem({ 
  contract, 
  onView, 
  onEdit, 
  onDelete, 
  onDuplicate,
  onSendEmail
}: ContractListItemProps) {
  const [showMenu, setShowMenu] = useState(false)

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
      active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
      expired: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
      cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400"
    }
    return colors[status as keyof typeof colors] || colors.draft
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: "Rascunho",
      pending: "Pendente",
      active: "Ativo",
      expired: "Expirado",
      cancelled: "Cancelado"
    }
    return labels[status as keyof typeof labels] || "Rascunho"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <div 
      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-3 bg-white dark:bg-gray-800 hover:border-[#6C5DD3] dark:hover:border-[#6C5DD3] transition-colors cursor-pointer"
      onClick={() => onView(contract)}
    >
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-[#6C5DD3]/10 dark:bg-[#6C5DD3]/20 rounded-lg">
          <FileText className="w-5 h-5 text-[#6C5DD3]" />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{contract.title}</h3>
          
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
            {contract.description && (
              <div className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                <span>{contract.description}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(contract.updated_at)}</span>
            </div>
            
            {contract.tags && contract.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span className="flex gap-1">
                  {contract.tags.slice(0, 2).map((tag, index) => (
                    <span key={index}>{tag}</span>
                  ))}
                  {contract.tags.length > 2 && <span>+{contract.tags.length - 2}</span>}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.status)}`}>
          {getStatusLabel(contract.status)}
        </span>
        
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Lógica para enviar por email
              console.log('Send contract', contract.id);
            }}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#6C5DD3] dark:hover:text-[#6C5DD3] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#6C5DD3] dark:hover:text-[#6C5DD3] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div 
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit(contract);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      onDelete(contract);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}