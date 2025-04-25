'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
// Supabase removido - protótipo frontend
import { Bell, Plus, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import NewBookingForm from '@/components/forms/NewBookingForm/'

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNewBooking, setShowNewBooking] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const userButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const getUser = async () => {
      // Simula usuário logado
      setUser({ id: 'mock-user', email: 'mock@user.com', name: 'Usuário Demo' })
      setLoading(false)
    }

    getUser()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUserMenu &&
        userMenuRef.current &&
        userButtonRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleSignOut = async () => {
    // Simula logout
    setUser(null)
    router.push('/auth/signin')
  }

  return (
    <>
      <header className="flex items-center justify-end h-[72px] px-6 h-[80px] bg-bg-primary border-b border-border-light">
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            onClick={() => setShowNewBooking(true)}
          >
            <Plus />
            New Booking
          </Button>

          <ThemeToggle />

          <button className="relative p-2 text-text-secondary hover:bg-bg-tertiary rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-state-error rounded-full" />
          </button>

          <div className="relative">
            <button
              ref={userButtonRef}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 hover:bg-bg-tertiary rounded-lg transition-colors"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-bg-tertiary flex items-center justify-center">
                {user?.email ? (
                  <span className="text-sm font-medium text-text-secondary">
                    {user.email.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-5 h-5 text-text-tertiary" />
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            </button>

            {showUserMenu && (
              <div
                ref={userMenuRef}
                className="absolute right-0 mt-2 w-48 bg-bg-primary rounded-lg shadow-lg border border-border-light py-1 z-50"
              >
                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-text-primary hover:bg-bg-tertiary"
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
                <button
                  onClick={() => {
                    router.push('/profile');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-text-primary hover:bg-bg-tertiary"
                >
                  <User className="w-4 h-4" />
                  Perfil
                </button>
                <hr className="my-1 border-border-light" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-state-error hover:bg-brand-primary-light"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <NewBookingForm
        isOpen={showNewBooking}
        onClose={() => setShowNewBooking(false)}
      />
    </>
  )
} 