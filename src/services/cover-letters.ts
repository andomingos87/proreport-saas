import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export type CoverLetterStatus = 'draft' | 'sent' | 'approved' | 'rejected'

export interface CoverLetter {
  id: string
  title: string
  description?: string
  content: string
  status: CoverLetterStatus
  is_template: boolean
  tags?: string[]
  created_at: string
  updated_at: string
  user_id: string
}

export const coverLettersService = {
  async list(): Promise<CoverLetter[]> {
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === '42P01') { // Tabela não existe
          console.error('A tabela cover_letters não existe. Execute o script SQL para criá-la.')
          toast.error('Tabela de cartas não encontrada. Contate o administrador.')
        } else {
          console.error('Erro ao buscar cartas:', error)
          toast.error('Erro ao carregar cartas')
        }
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Erro ao buscar cartas:', error)
      toast.error('Erro ao carregar cartas')
      return []
    }
  },

  async ensureAuth() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Erro de autenticação:', error)
      throw new Error('Falha na autenticação')
    }
    if (!session?.user) {
      throw new Error('User not authenticated')
    }
    return session.user
  },

  async create(data: Partial<CoverLetter>): Promise<CoverLetter | null> {
    try {
      // Obter o usuário autenticado
      const user = await this.ensureAuth()
      const user_id = user.id
      
      // Garante que os campos obrigatórios estejam presentes
      const coverLetterData = {
        title: data.title || 'Nova Carta',
        content: data.content || '',
        description: data.description,
        status: data.status || 'draft',
        is_template: data.is_template || false,
        tags: data.tags || [],
        user_id
      }

      const { data: newCoverLetter, error } = await supabase
        .from('cover_letters')
        .insert([coverLetterData])
        .select()
        .single()

      if (error) throw error
      return newCoverLetter
    } catch (error: any) {
      console.error('Erro ao criar carta:', error)
      if (error.message === 'User not authenticated') {
        toast.error('Usuário não autenticado. Por favor, faça login novamente.')
      } else {
        toast.error(error?.message || 'Erro ao criar carta')
      }
      return null
    }
  },

  async update(id: string, data: Partial<CoverLetter>): Promise<CoverLetter | null> {
    try {
      // Verificar autenticação antes de atualizar
      await this.ensureAuth()
      
      // Remove campos que não devem ser atualizados
      const { id: _, created_at, updated_at, user_id, ...updateData } = data

      const { data: updatedCoverLetter, error } = await supabase
        .from('cover_letters')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return updatedCoverLetter
    } catch (error: any) {
      console.error('Erro ao atualizar carta:', error)
      if (error.message === 'User not authenticated') {
        toast.error('Usuário não autenticado. Por favor, faça login novamente.')
      } else {
        toast.error(error?.message || 'Erro ao atualizar carta')
      }
      return null
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      // Verificar autenticação antes de excluir
      await this.ensureAuth()
      
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error: any) {
      console.error('Erro ao excluir carta:', error)
      if (error.message === 'User not authenticated') {
        toast.error('Usuário não autenticado. Por favor, faça login novamente.')
      } else {
        toast.error(error?.message || 'Erro ao excluir carta')
      }
      return false
    }
  },

  async duplicate(id: string, newTitle?: string): Promise<CoverLetter | null> {
    try {
      // Verificar autenticação antes de duplicar
      const user = await this.ensureAuth()
      
      // Primeiro, busca a carta original
      const { data: original, error: fetchError } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Remove campos que não devem ser duplicados
      const { id: _, created_at, updated_at, ...coverLetterData } = original

      // Atualiza o título se fornecido
      const duplicateData = {
        ...coverLetterData,
        title: newTitle || `${original.title} (Cópia)`,
        user_id: user.id // Garantir que a cópia pertença ao usuário atual
      }

      // Cria a nova carta
      const { data: newCoverLetter, error } = await supabase
        .from('cover_letters')
        .insert([duplicateData])
        .select()
        .single()

      if (error) throw error
      return newCoverLetter
    } catch (error: any) {
      console.error('Erro ao duplicar carta:', error)
      if (error.message === 'User not authenticated') {
        toast.error('Usuário não autenticado. Por favor, faça login novamente.')
      } else {
        toast.error(error?.message || 'Erro ao duplicar carta')
      }
      return null
    }
  },

  async updateStatus(id: string, status: CoverLetterStatus): Promise<CoverLetter | null> {
    try {
      // Verificar autenticação antes de atualizar status
      await this.ensureAuth()
      
      const { data, error } = await supabase
        .from('cover_letters')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error: any) {
      console.error('Erro ao atualizar status da carta:', error)
      if (error.message === 'User not authenticated') {
        toast.error('Usuário não autenticado. Por favor, faça login novamente.')
      } else {
        toast.error(error?.message || 'Erro ao atualizar status')
      }
      return null
    }
  },

  getStatusLabel(status: CoverLetterStatus): string {
    const labels: Record<CoverLetterStatus, string> = {
      draft: 'Rascunho',
      sent: 'Enviada',
      approved: 'Aprovada',
      rejected: 'Rejeitada'
    }
    return labels[status]
  },

  getStatusColor(status: CoverLetterStatus): string {
    const colors: Record<CoverLetterStatus, string> = {
      draft: 'gray',
      sent: 'blue',
      approved: 'green',
      rejected: 'red'
    }
    return colors[status]
  }
} 