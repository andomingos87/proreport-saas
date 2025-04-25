'use client'

import { FileText } from 'lucide-react'
import { Contract } from '@/services/contracts'
import { ContractCard } from './ContractCard'

type ContractListProps = {
  loading: boolean
  contracts: Contract[]
  selectedContractId?: string
  onSelect: (contract: Contract) => void
  onEdit: (contract: Contract) => void
  onDelete: (contract: Contract) => void
  onCreateNew: () => void
}

export function ContractList({
  loading,
  contracts,
  selectedContractId,
  onSelect,
  onEdit,
  onDelete,
  onCreateNew
}: ContractListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Modelos de Contrato
      </h3>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB800]"></div>
        </div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">
            Nenhum modelo de contrato disponível
          </p>
          <button
            onClick={onCreateNew}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#FFB800] bg-[#FFF9E6] dark:bg-[#FFB800]/10 rounded-lg hover:bg-[#FFF5D6] dark:hover:bg-[#FFB800]/20"
          >
            Criar Novo Modelo
          </button>
        </div>
      ) : (
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
          {contracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              isSelected={selectedContractId === contract.id}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
