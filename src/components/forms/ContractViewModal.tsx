import { X, Download, Copy, Share } from 'lucide-react'
import { Contract, ContractStatus } from '@/services/contracts'

interface ContractViewModalProps {
  isOpen: boolean
  onClose: () => void
  contract?: Contract
  onEdit?: (contract: Contract) => void
  onSendEmail?: (contract: Contract) => void
  onUpdateStatus?: (contract: Contract, status: ContractStatus) => Promise<void>
}

export function ContractViewModal({ 
  isOpen, 
  onClose, 
  contract,
  onEdit,
  onSendEmail,
  onUpdateStatus
}: ContractViewModalProps) {
  if (!isOpen || !contract) return null

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contract.content)
      alert('Contrato copiado para a área de transferência!')
    } catch (err) {
      console.error('Falha ao copiar para a área de transferência:', err)
      alert('Não foi possível copiar para a área de transferência.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {contract.title}
            </h3>
            {contract.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {contract.description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="prose dark:prose-invert max-w-none">
            {/* Exibe o conteúdo do contrato com formatação de quebras de linha */}
            {contract.content.split('\n').map((line, index) => (
              <p key={index}>{line || <br />}</p>
            ))}
          </div>
        </div>

        <div className="flex justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {contract.tags && contract.tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">Tags:</span>
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
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copiar</span>
            </button>
            
            <button
              onClick={() => {}} // Implementar download como PDF se necessário
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
            
            <button
              onClick={() => {}} // Implementar compartilhamento se necessário
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[#6C5DD3] rounded-lg hover:bg-[#5B4EC7] transition-colors"
            >
              <Share className="w-4 h-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}