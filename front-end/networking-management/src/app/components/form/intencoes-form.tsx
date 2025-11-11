'use client'

import { useForm } from "react-hook-form"
import { api } from "@/lib/api/axios"
import { Input } from "@/app/components/ui/input/input"
import { TIntention } from "@/@types/member"
import { useState } from "react"
import { toast } from "react-toastify"

export function IntentionForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<TIntention>()

  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const onSubmit = async (data: TIntention) => {
    console.log("Form data:", data)
    try {
      await api.post("/intencoes", data)
      setSuccessMessage("Membro criado com sucesso!")
      toast.success("Intenção enviada com sucesso!")
      reset()
    } catch (error) {
      console.error("Erro ao criar membro:", error)
      setSuccessMessage("Erro ao criar membro. Tente novamente.")
      toast.error("Erro ao enviar intenção. Tente novamente mais tarde.")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <Input
          {...register("name", { required: "O nome é obrigatório" })}
          placeholder="Digite o nome completo"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input
          type="email"
          {...register("email", { required: "O e-mail é obrigatório" })}
          placeholder="Digite o e-mail"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
        <Input
          type="text"
          {...register("empresa", { required: "O Campo empresa é obrigatorio" })}
          placeholder="Empresa atual"
        />
        {errors.empresa && <p className="text-sm text-red-500">{errors.empresa.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Interesse</label>
        <textarea
          {...register("motivo", { required: "O motivo é obrigatório" })}
          className="w-full h-28 resize-none px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
          placeholder="Conte um pouco sobre seu interesse..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-sky-600 text-white font-medium py-3 rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Enviando..." : "Enviar Intenção"}
      </button>

     
    </form>
  )
}
