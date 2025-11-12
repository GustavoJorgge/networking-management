'use client'
import { useAuth } from '@/hooks/useAuth'
import { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { authenticated } = useAuth()

  if (authenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Verificando acesso...
      </div>
    )
  }

  if (!authenticated) return null

  return <>{children}</>
}
