import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.membro.upsert({
        where: { email: 'teste@agsistemas.com' },
        update: {},
        create: {
            name: 'Usuário Teste',
            email: 'teste@agsistemas.com',
            empresa: 'AG Sistemas',
            status: 'ATIVO',
        },
    })
    console.log('✅ Membro de teste inserido com sucesso!')
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect())
