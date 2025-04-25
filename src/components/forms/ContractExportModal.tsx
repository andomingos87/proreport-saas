// src/components/forms/ContractExportModal.tsx
import { useState } from 'react'
import { X, FileText, Download, Send, Mail, Copy, File, FileText as FileDocx } from 'lucide-react'
import { Contract } from '@/services/contracts'

interface ContractExportModalProps {
  isOpen: boolean
  onClose: () => void
  contract: Contract
}

export function ContractExportModal({ isOpen, onClose, contract }: ContractExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx'>('pdf')
  const [isExporting, setIsExporting] = useState(false)
  const [emailTo, setEmailTo] = useState('')

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Simulação de exportação
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`Exportando contrato para ${exportFormat}`)
      // Adicione aqui a lógica de exportação real
      
      onClose()
    } catch (error) {
      console.error('Erro ao exportar:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleSendEmail = async () => {
    if (!emailTo) return
    
    setIsExporting(true)
    try {
      // Simulação de envio de e-mail
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`Enviando contrato por e-mail para ${emailTo}`)
      // Adicione aqui a lógica de envio de e-mail real
      
      onClose()
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error)
    } finally {
      setIsExporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Exportar Contrato
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              {contract.title || "Contrato Sem Título"}
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Formato de Exportação
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportFormat('pdf')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
                      exportFormat === 'pdf'
                        ? 'border-[#6C5DD3] bg-[#6C5DD3]/10 text-[#6C5DD3]'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <File className="w-5 h-5" />
                    <span>PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportFormat('docx')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border ${
                      exportFormat === 'docx'
                        ? 'border-[#6C5DD3] bg-[#6C5DD3]/10 text-[#6C5DD3]'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FileDocx className="w-5 h-5" />
                    <span>DOCX</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 p-3 bg-[#6C5DD3] text-white rounded-lg hover:bg-[#5B4EC7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                <span>{isExporting ? 'Exportando...' : 'Baixar Contrato'}</span>
              </button>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-600 dark:text-gray-400">ou</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enviar por Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="Endereço de email"
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={!emailTo || isExporting}
                    className="p-2 bg-[#6C5DD3] text-white rounded-lg hover:bg-[#5B4EC7] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("Link para o contrato aqui")
                }}
                className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Copy className="w-5 h-5" />
                <span>Copiar Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}