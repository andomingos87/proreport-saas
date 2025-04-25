import { FileText, Tag, Calendar, Copy, Pencil, Trash2, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Contract } from '@/services/contracts'

interface ContractCardProps {
  contract: Contract
  onView: (contract: Contract) => void
  onEdit: (contract: Contract) => void
  onDelete: (contract: Contract) => void
  onDuplicate: (contract: Contract) => void
}

export function ContractCard({ 
  contract, 
  onView, 
  onEdit, 
  onDelete,
  onDuplicate 
}: ContractCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ptBR
      })
    } catch (e) {
      return dateString
    }
  }

  // Função para lidar com o clique no card
  const handleCardClick = (e: React.MouseEvent) => {
    // Verifica se o clique não foi em um dos botões de ação
    if (!(e.target as HTMLElement).closest('.action-buttons')) {
      onView(contract);
    }
  };

  // Função para obter um preview do conteúdo do contrato
  const getContentPreview = () => {
    if (!contract.content) return '';
    
    // Remove quebras de linha extras e espaços em branco
    const cleanContent = contract.content.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ');
    
    // Limita o preview a um número razoável de caracteres
    return cleanContent.length > 150 
      ? `${cleanContent.substring(0, 150)}...` 
      : cleanContent;
  };

  return (
    <div 
      className="w-full border rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:border-[#6C5DD3] dark:hover:border-[#6C5DD3] transition-colors cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${contract.is_template ? 'bg-[#6C5DD3]/10 dark:bg-[#6C5DD3]/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <FileText className={`w-5 h-5 ${contract.is_template ? 'text-[#6C5DD3]' : 'text-gray-500 dark:text-gray-400'}`} />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">{contract.title}</h3>
              <div className="flex items-center mt-1">
                <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(contract.updated_at)}
                </span>
              </div>
            </div>
          </div>
          
          {contract.is_template && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#6C5DD3]/10 text-[#6C5DD3] dark:bg-[#6C5DD3]/20">
              Modelo
            </span>
          )}
        </div>
        
        {contract.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {contract.description}
          </p>
        )}

        {/* Preview do conteúdo do contrato */}
        {contract.content && (
          <div className="mb-3 bg-gray-50 dark:bg-gray-700/50 rounded-md p-2">
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 font-mono">
              {getContentPreview()}
            </p>
          </div>
        )}

        {contract.tags && contract.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-1 mb-3">
            <Tag className="w-3 h-3 text-gray-400" />
            {contract.tags.map((tag, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 action-buttons">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(contract);
            }}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
            title="Visualizar contrato"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(contract);
            }}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
            title="Duplicar contrato"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(contract);
            }}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
            title="Editar contrato"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(contract);
            }}
            className="p-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
            title="Excluir contrato"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}