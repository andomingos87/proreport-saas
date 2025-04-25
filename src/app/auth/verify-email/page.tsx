'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            ProReport
          </h1>
          <div className="mt-6 flex justify-center">
            <div className="p-3 bg-[#6C5DD3]/10 rounded-full">
              <Mail className="w-12 h-12 text-[#6C5DD3]" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
            Verifique seu e-mail
          </h2>
          <p className="mt-4 text-center text-base text-gray-600">
            Enviamos um link de confirmação para o seu e-mail.
            Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <p className="text-center text-sm text-gray-600">
            Não recebeu o e-mail?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-[#6C5DD3] hover:text-[#5B4EC7]"
            >
              Tentar novamente
            </Link>
          </p>

          <p className="text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-[#6C5DD3] hover:text-[#5B4EC7]"
            >
              voltar para o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 