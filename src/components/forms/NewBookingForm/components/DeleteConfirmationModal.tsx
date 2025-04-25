'use client'

import { Trash2 } from 'lucide-react'
import { Contract } from '@/services/contracts'

type DeleteConfirmationModalProps = {
  isOpen: boolean
  contract: Contract | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmationModal({
  isOpen,
  contract,
  onClose,
  onConfirm
}: DeleteConfirmationModalProps) {
  if (!isOpen || !contract) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70" onClick={onClose} />
        
        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="text-center">
            <Trash2 className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Excluir Contrato
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Tem certeza que deseja excluir o contrato <strong>{contract.title}</strong>? Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
