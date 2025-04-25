'use client'

import { X, Pencil, Mail, Copy } from 'lucide-react'
import { CoverLetter, CoverLetterStatus } from '@/services/cover-letters'

type CoverLetterViewModalProps = {
  isOpen: boolean
  onClose: () => void
  coverLetter: CoverLetter
  onEdit: (coverLetter: CoverLetter) => void
  onSendEmail: (coverLetter: CoverLetter) => void
  onUpdateStatus: (coverLetter: CoverLetter, status: CoverLetterStatus) => void
  onDuplicate: (coverLetter: CoverLetter) => void
}

export function CoverLetterViewModal({
  isOpen,
  onClose,
  coverLetter,
  onEdit,
  onSendEmail,
  onUpdateStatus,
  onDuplicate
}: CoverLetterViewModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {coverLetter.title}
              </h3>
              {coverLetter.description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {coverLetter.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(coverLetter)}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                title="Editar"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDuplicate(coverLetter)}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                title="Salvar como Nova Carta"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={() => onSendEmail(coverLetter)}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                title="Enviar por Email"
              >
                <Mail className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status:
                </span>
                <select
                  value={coverLetter.status}
                  onChange={(e) => onUpdateStatus(coverLetter, e.target.value as CoverLetterStatus)}
                  className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] focus:border-transparent"
                >
                  <option value="draft">Rascunho</option>
                  <option value="sent">Enviada</option>
                  <option value="approved">Aprovada</option>
                  <option value="rejected">Rejeitada</option>
                </select>
              </div>

              {coverLetter.is_template && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  Modelo
                </span>
              )}
            </div>

            {coverLetter.tags && coverLetter.tags.length > 0 && (
              <div className="mb-6">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags:
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {coverLetter.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                {coverLetter.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 