'use client'

import { useForm } from "react-hook-form"
import { api } from "@/lib/api/axios"
import { Input } from "@/app/components/ui/input/input"
import { TIntention } from "@/@types/member"
import { toast } from "react-toastify"
import { useEffect } from "react"

export function IntentionForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TIntention>()

  const motivoValue = watch("motivo", "")

   useEffect(() => {
    if (motivoValue.length < 10) {
      toast.warn("O motivo deve ter no mínimo 10 caracteres")
    } else if (motivoValue.length > 1000) {
      toast.error("O motivo ultrapassou o limite de 1000 caracteres")
    }
  }, [motivoValue])

  const onSubmit = async (data: TIntention) => {
    console.log("Form data:", data)
    try {
      await api.post("/intencoes", data)
      toast.success("Intenção enviada com sucesso!")
      reset()
    } catch (error) {
      console.error("Erro ao criar membro:", error)
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
          className={`${
            errors.name
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-sky-500"
          }`}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input
          type="email"
          {...register("email", { required: "O e-mail é obrigatório" })}
          placeholder="Digite o e-mail"
          className={`${
            errors.email
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-sky-500"
          }`}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
        <Input
          type="text"
          {...register("empresa", { required: "O campo empresa é obrigatório" })}
          placeholder="Empresa atual"
          className={`${
            errors.empresa
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-sky-500"
          }`}
        />
        {errors.empresa && <p className="text-sm text-red-500">{errors.empresa.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Interesse</label>
        <textarea
          {...register("motivo", {
            required: "O motivo é obrigatório",
            minLength: { value: 10, message: "O motivo deve ter no mínimo 10 caracteres" },
            maxLength: { value: 1000, message: "O motivo deve ter no máximo 1000 caracteres" },
          })}
          className={`w-full h-28 resize-none px-4 py-2 rounded-lg border bg-gray-50 text-gray-800 text-base shadow-sm transition-all duration-200 ease-in-out ${
            errors.motivo ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-sky-500"
          }`}
          placeholder="Conte um pouco sobre seu interesse..."
        />
        <div className="flex justify-between items-center mt-1">
          {errors.motivo && <p className="text-sm text-red-500">{errors.motivo.message}</p>}
          <p
            className={`text-sm ${
              motivoValue.length > 1000 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {motivoValue.length}/1000
          </p>
          </div>
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
