'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <Sidebar />
      <div className="pl-60">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 