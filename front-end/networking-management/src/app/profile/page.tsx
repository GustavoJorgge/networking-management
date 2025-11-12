'use client'

import { TMembro } from "@/@types/member"
import { Input } from "@/app/components/ui/input/input"
import ProtectedRoute from "@/hooks/ProtectedRoute"
import { api } from "@/lib/api/axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TMembro>()

  // Busca o usuário logado ao carregar
  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get("/profile")
        reset(data)
      } catch (error) {
        toast.error("Erro ao carregar perfil. Faça login novamente.")
        console.error("Erro ao buscar perfil:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [reset, router])

  // Atualiza perfil
  const onSubmit = async (formData: TMembro) => {
    try {
      await api.put("/profile", formData)
      toast.success("Perfil atualizado com sucesso!")
      setEditing(false)
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast.error("Erro ao atualizar perfil. Tente novamente mais tarde.")
    }
  }

  const handleCancel = () => {
    setEditing(false)
    // Recarrega os dados originais do formulário
    async function fetchProfile() {
      try {
        const { data } = await api.get("/profile")
        reset(data)
      } catch (error) {
        console.error("Erro ao recarregar perfil:", error)
      }
    }
    fetchProfile()
    toast.info("Edição cancelada")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-gray-500 text-lg">Carregando perfil...</p>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div data-editing={editing} className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Meu Perfil</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <Input
              {...register("name", { required: "O nome é obrigatório" })}
              disabled={!editing}
              className={`${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-sky-500"
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <Input
              type="email"
              {...register("email", { required: "O e-mail é obrigatório" })}
              disabled={!editing}
              className={`${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-sky-500"
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <Input
              type="text"
              {...register("empresa")}
              disabled={!editing}
              placeholder="Empresa atual"
              className={`${
                errors.empresa
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-sky-500"
              }`}
            />
            {errors.empresa && (
              <p className="text-sm text-red-500">{errors.empresa.message}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <Input
              type="tel"
              {...register("telefone")}
              disabled={!editing}
              placeholder="(00) 0 0000-0000"
              className={`${
                errors.telefone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-sky-500"
              }`}
            />
            {errors.telefone && (
              <p className="text-sm text-red-500">{errors.telefone.message}</p>
            )}
          </div>

          {/* Cargo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
            <Input
              type="text"
              {...register("cargo")}
              disabled={!editing}
              placeholder="Cargo ou função"
              className={`${
                errors.cargo
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-sky-500"
              }`}
            />
            {errors.cargo && (
              <p className="text-sm text-red-500">{errors.cargo.message}</p>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 mt-6">
            {editing ? (
              <>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-sky-600 text-white font-medium py-2 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 text-white font-medium py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setEditing(true)
                  }}
                  className="flex-1 bg-sky-600 text-white font-medium py-2 rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Editar Perfil
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push("/intention/list")
                  }}
                  className="flex-1 bg-gray-500 text-white font-medium py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Voltar
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}