
# Plataforma de Gestão para Grupos de Networking

Sistema completo para a gestão de membros, comunicados e intenção de participar do grupo.

---

## 🚀 Funcionalidades Implementadas

### 👥 Gestão de Membros
- ✅ Formulário público para intenção de participação  
- ✅ Área administrativa para aprovação/rejeição de intenções  
- ✅ Sistema de estatísticas em tempo real (pendentes, aprovados, rejeitados)  
- ✅ Perfis de usuário editáveis  

### 🗣️ Comunicação
- ✅ Sistema de comunicados com funções de criação, visualização e exclusão  
- ✅ Identificação automática do autor via JWT  
- ✅ Cards estatísticos (total, hoje, esta semana)  
- ✅ Formatação de datas em português (pt-BR)  

### 🔐 Autenticação
- ✅ Sistema de login via JWT  
- ✅ Proteção de rotas privadas  
- ✅ Middleware de autenticação no backend  

---

## 🧩 Arquitetura do Projeto

### 🖥️ Backend
- **Node.js**: Plataforma de execução para servidores  
- **Fastify**: Escolhido pela alta performance  
- **Prisma ORM**: Facilita a criação de modelos e gestão de migrations  
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional  
- **Docker Compose**: Simplifica a execução do projeto em diferentes ambientes  
- **JWT**: Autenticação por tokens para proteger rotas  
- **ZOD**: Validação de Schemas para entrada de dados  
- **Swagger**: Testes de requisições e documentação automática da API  
- **Jest**: Framework de testes (aplicados apenas 2, devido à limitação de tempo)  
- **Biome**: Ferramenta para formatação de código  

### 💻 Frontend
- **Next.js**: Framework React para aplicações web  
- **React**: Biblioteca para construção de interfaces de usuário  
- **TypeScript**: Tipagem estática para evitar erros de schema  
- **Tailwind CSS**: Framework de CSS para estilização rápida e responsiva  
- **Axios**: Cliente HTTP para facilitar chamadas de API  
- **React Hook Form**: Gerenciamento de formulários com validação  
- **date-fns**: Biblioteca para manipulação de datas  
- **Lucide React**: Ícones para aprimorar a UI  
- **React Toastify**: Notificação de pop-ups  

---

## ⚙️ Como Executar o Projeto

### 🧾 Requisitos
- Node.js e NPM/pnpm/yarn instalados localmente  
- Docker e Docker Compose  
- Git  

---

### 🛠️ Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/GustavoJorgge/networking-management
   ```

2. **Configure o Backend**
   ```bash
   cd back-end
   npm install
   cp .env.example .env
   ```

3. **Configure o arquivo `.env`:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/networking_db?schema=public"
   JWT_SECRET="seu-secret-super-seguro-aqui"
   PORT=3333
   ```

4. **Inicie o banco de dados:**
   ```bash
   docker-compose up -d
   ```

5. **Execute as migrations do Prisma:**
   ```bash
   npx prisma migrate dev
   ```

   > 💡 Observação: Inclua um e-mail genérico para realizar testes iniciais.

6. **Inicie o Backend:**
   ```bash
   npm run dev
   ```

   O backend estará rodando em **http://localhost:3333**  
   Acesse a documentação Swagger em: **http://localhost:3333/docs**

---

### 🌐 Configure o Frontend

1. Abra um novo terminal:
   ```bash
   cd front-end/networking-management
   npm install
   cp .env.example .env.local
   npm run dev
   ```

   O frontend estará rodando em **http://localhost:3000**

---

### Acesso Inicial
1. Acesse [http://localhost:3000](http://localhost:3000).
2. Crie uma intenção preenchendo o formulário.
   ![Formulário](https://github.com/user-attachments/assets/51dc86d5-93f3-4d62-b67e-5c4a2f75f4c6)
3. Clique em "Ver inscrições" e faça login com o e-mail `agsistemas@teste.com`.
   ![Login](https://github.com/user-attachments/assets/965296b4-92ff-4931-ac61-0c765246ead8)

### Navegação
- **/intentions/list**: Página com a lista de todas as intenções cadastradas para Aprovar/Rejeitar/Excluir. (Melhoria futura: incluir paginação e gerenciamento de estado).
   ![Lista de Intenções](https://github.com/user-attachments/assets/3cfa4258-007e-484b-a1bc-87d0e0b8c5a2)
   > Ao aprovar uma intenção, o usuário se torna um membro e obtém acesso ao sistema.

- **/comunicados**: Página de avisos onde é possível criar novos comunicados, visualizar histórico e excluir comunicados.
   ![Comunicados](https://github.com/user-attachments/assets/0e03cca7-8d97-4421-8462-fc3c59b47afe)

- **/profile**: Dados do usuário para editar informações e atualizar dados (disponível apenas para membros ativos).


## 🧱 Estrutura do Projeto

```
.
├── .docs                     # Documentação de Arquitetura e Collection
├── back-end/
│   ├── src/
│   │   ├── domain/           # Entidades e regras de negócio
│   │   ├── infra/            # Infraestrutura (Prisma, migrations)
│   │   ├── routes/           # Definição de rotas da API
│   │   ├── middlewares/      # Middlewares (autenticação, etc.)
│   │   └── server.ts         # Configuração do servidor Fastify
│   ├── prisma/
│   │   ├── schema.prisma     # Schema do banco de dados
│   │   └── migrations/       # Histórico de migrations
│   ├── tests/                # Testes unitários e de integração
│   ├── docker-compose.yml    # Configuração do PostgreSQL
│   └── package.json
│
└── front-end/networking-management/
    ├── src/
    │   ├── app/
    │   │   ├── components/   # Componentes reutilizáveis
    │   │   │   └── ui/       # Componentes de interface
    │   │   ├── comunicados/  # Página de comunicados
    │   │   ├── intention/    # Páginas de intenções
    │   │   ├── profile/      # Página de perfil
    │   │   └── login/        # Página de login
    │   ├── @types/           # Definições de tipos TypeScript
    │   ├── hooks/            # Custom hooks (ProtectedRoute)
    │   └── lib/              # Configurações (axios, etc.)
    └── package.json
```

---
