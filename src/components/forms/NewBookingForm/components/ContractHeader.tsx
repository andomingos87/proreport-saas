'use client'

import { Plus, Search } from 'lucide-react'

type ContractHeaderProps = {
  search: string
  onSearchChange: (value: string) => void
  onCreateContract: () => void
}

export function ContractHeader({ search, onSearchChange, onCreateContract }: ContractHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Buscar contratos..."
        />
      </div>
      <button
        onClick={onCreateContract}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#FFB800] rounded-lg hover:bg-[#E6A600] transition-colors"
      >
        <Plus className="w-4 h-4" />
        Novo Contrato
      </button>
    </div>
  )
}
