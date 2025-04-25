'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  LayoutDashboard, 
  CreditCard, 
  FileText, 
  Briefcase, 
  Users,
  ClipboardCheck,
  ScrollText,
  Mail,
  Contact,
  Crown
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: CreditCard, label: 'Billing', href: '/billing' },
  { icon: FileText, label: 'Reports', href: '/reports' },
  { icon: Briefcase, label: 'Services', href: '/services' },
  { icon: ClipboardCheck, label: 'Inspections', href: '/inspections' },
  { icon: ScrollText, label: 'Contracts', href: '/contracts' },
  { icon: FileText, label: 'Cover Letters', href: '/cover-letters' },
  { icon: Mail, label: 'Emails', href: '/emails' },
  { icon: Contact, label: 'Contacts', href: '/contacts' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme } = useTheme()

  return (
    <aside className="fixed top-0 left-0 flex flex-col w-60 h-screen bg-bg-primary border-r border-border-light">
      <div className="flex items-center justify-center px-6 h-[80px] py-5 border-b border-border-light">
        <Image
          src={theme === 'dark' ? '/assets/images/logo_light.png' : '/assets/images/logo_dark.png'}
          alt="ProReport Logo"
          width={168}
          height={50}
          priority
        />
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-brand-primary text-white' 
                  : 'text-text-primary hover:bg-bg-tertiary'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-5 mx-2 mb-4 rounded-lg bg-gradient-to-r from-[#FFB800] to-[#FFD466] shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
        {/* Efeito de brilho animado */}
        <div className="absolute inset-0 bg-white/10 w-20 h-full transform -skew-x-12 -translate-x-32 group-hover:translate-x-96 transition-transform duration-1000 ease-in-out"></div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-white animate-pulse" />
            <span className="text-sm font-bold text-white">PRO</span>
          </div>
          <span className="px-2 py-1 text-xs font-medium text-white bg-white/30 rounded-full border border-white/40">Exclusivo</span>
        </div>
        
        <h3 className="text-base font-semibold text-white mb-1">Upgrade para Pro</h3>
        <p className="text-xs font-medium text-white/90 mb-3">Acesse recursos exclusivos e aumente sua produtividade</p>
        
        <button className="w-full px-3 py-2.5 text-sm font-medium text-[#FFB800] bg-bg-primary rounded-lg hover:bg-bg-secondary transition-colors flex items-center justify-center gap-2 group-hover:scale-105 transform transition-transform duration-300">
          Fazer Upgrade
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </aside>
  )
} 