import prisma from "@/infra/prisma/client"
import { FastifyInstance } from "fastify"
import z from "zod"

export function getIntencoesRoute(server: FastifyInstance) {
    server.get('/intencoes', {
        schema: {
            tags: ["Intenções"],
            summary: 'Lista todas as intenções de participação cadastradas',
            response: {
                200: z.array(z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    email: z.string().email(),
                    empresa: z.string(),
                    motivo: z.string(),
                    status: z.string()
                }))
            }
        }
    }, async (request, reply) => {
        const intencoes = await prisma.intencaoParticipar.findMany()
        return reply.status(200).send(intencoes)
    })
}
