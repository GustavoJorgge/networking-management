import { Content } from "./components/content/content"
import { Title } from "./components/title/title"
import { Input } from "./components/ui/input/input"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-sky-50 to-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-10">
        <div className="text-center">
          <Title>Bem-vindo ao Sistema de Admissão de Membros</Title>

          <Content>
            Faça parte de uma rede exclusiva de profissionais. Cadastre sua intenção de
            entrar para AG Sistemas!
          </Content>
        </div>

        <form className="mt-5 space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome:
            </label>
            <Input id="name" name="name" placeholder="Digite seu nome completo" required />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <Input id="email" name="email" type="email" placeholder="Seu melhor e-mail" required />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone:
            </label>
            <Input id="phone" name="phone" type="tel" placeholder="(00) 00000-0000" required />
          </div>

          <div>
            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
              Motivo de Interesse:
            </label>
            <textarea
              id="motivo"
              name="motivo"
              required
              placeholder="Conte um pouco sobre seu interesse..."
              className="w-full h-28 resize-none px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder:text-gray-400 transition-all duration-200 ease-in-out"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-sky-600 text-white font-medium py-3 rounded-lg hover:bg-sky-700 transition-colors"
            >
              Enviar Intenção
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
