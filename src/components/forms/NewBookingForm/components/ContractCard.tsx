'use client'

import { Eye, Pencil, Copy, Trash2 } from 'lucide-react'
import { Contract, contractsService } from '@/services/contracts'
import { toast } from 'sonner'

type ContractCardProps = {
  contract: Contract
  isSelected: boolean
  onSelect: (contract: Contract) => void
  onEdit: (contract: Contract) => void
  onDelete: (contract: Contract) => void
}

export function ContractCard({
  contract,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}: ContractCardProps) {
  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const newContract = await contractsService.duplicate(contract.id)
      toast.success('Contrato duplicado com sucesso')
    } catch (error) {
      console.error('Error duplicating contract:', error)
      toast.error('Falha ao duplicar contrato')
    }
  }

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
        isSelected
          ? 'border-[#FFB800] bg-[#FFF9E6] dark:bg-[#FFB800]/10'
          : 'border-gray-200 dark:border-gray-700 hover:border-[#FFB800] dark:hover:border-[#FFB800]'
      }`}
    >
      <div className="flex justify-between">
        <div 
          className="flex-1"
          onClick={() => onSelect(contract)}
        >
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {contract.title}
          </h4>
          {contract.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {contract.description}
            </p>
          )}
          {contract.tags && contract.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
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
        </div>
        <div className="flex flex-col gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect(contract)
            }}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
            title="Visualizar contrato"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(contract)
            }}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
            title="Editar contrato"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDuplicate}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
            title="Duplicar contrato"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(contract)
            }}
            className="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
            title="Excluir contrato"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
