'use client'

import { X } from 'lucide-react'
import { Contract } from '@/services/contracts'

type ContractPreviewModalProps = {
  contract: Contract
  isOpen: boolean
  onClose: () => void
}

export function ContractPreviewModal({ contract, isOpen, onClose }: ContractPreviewModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70" onClick={onClose} />
        
        <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {contract.title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <div className="h-[60vh] overflow-y-auto p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              {contract.content.split('\n').map((line, index) => (
                <p key={index}>{line || <br />}</p>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
