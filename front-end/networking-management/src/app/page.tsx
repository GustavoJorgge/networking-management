import { Content } from "./components/content/content"
import { IntentionForm } from "./components/form/intencoes-form"
import { Title } from "./components/title/title"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="w-full h-full max-h-screen max-w-xl bg-white shadow-xl rounded-xl p-6">
        <div className="text-center">
          <Title>Bem-vindo ao Sistema de Admissão de Membros</Title>

          <Content>
            Faça parte de uma rede exclusiva de profissionais. Cadastre sua intenção de
            entrar para AG Sistemas!
          </Content>
        </div>

         <div className="mt-7">
          <IntentionForm />
        </div>
      </div>
    </div>
  )
}
