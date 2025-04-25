'use client'

import { Eye, Pencil, Copy, Trash, Mail } from 'lucide-react'
import { CoverLetter } from '@/services/cover-letters'

type CoverLetterListItemProps = {
  coverLetter: CoverLetter
  onView: (coverLetter: CoverLetter) => void
  onEdit: (coverLetter: CoverLetter) => void
  onDelete: (coverLetter: CoverLetter) => void
  onDuplicate: (coverLetter: CoverLetter) => void
  onSendEmail: (coverLetter: CoverLetter) => void
}

export function CoverLetterListItem({
  coverLetter,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onSendEmail
}: CoverLetterListItemProps) {
  const handleItemClick = (e: React.MouseEvent) => {
    // Não abrir o modal se clicar em algum botão de ação
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    onView(coverLetter)
  }

  return (
    <div 
      onClick={handleItemClick}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {coverLetter.title}
            </h3>
            {coverLetter.is_template && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Modelo
              </span>
            )}
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              coverLetter.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' :
              coverLetter.status === 'sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
              coverLetter.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              {coverLetter.status === 'draft' ? 'Rascunho' :
               coverLetter.status === 'sent' ? 'Enviada' :
               coverLetter.status === 'approved' ? 'Aprovada' :
               'Rejeitada'}
            </span>
          </div>
          {coverLetter.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {coverLetter.description}
            </p>
          )}
          {coverLetter.tags && coverLetter.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {coverLetter.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(coverLetter)
            }}
            className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDuplicate(coverLetter)
            }}
            className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            title="Duplicar"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSendEmail(coverLetter)
            }}
            className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            title="Enviar por Email"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(coverLetter)
            }}
            className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            title="Excluir"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 