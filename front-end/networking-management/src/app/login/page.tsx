'use client'

import { api } from '@/lib/api/axios'
import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    if (!email.trim()) {
      toast.warning('Informe seu e-mail')
      return
    }

    try {
      setLoading(true)
      const { data } = await api.post('/login', { email })

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      toast.success('Login realizado com sucesso!')
      router.push('/intentions/list') 
    } catch (error) {
      toast.error('Falha no login. Verifique o e-mail informado.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Acesso Restrito
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all cursor-pointer"
          >
            <LogIn size={20} />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        

        <p className="text-center text-sm text-gray-500 mt-6">
          Use o e-mail <span className="font-medium text-gray-700">agsistemas@teste.com</span> para acessar o sistema.
        </p>
      </div>
    </div>
  )
}
