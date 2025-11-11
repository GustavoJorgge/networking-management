import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '@/infra/prisma/client';


export function getMemberRoute(server: FastifyInstance) {
    server.get('/members', {
        schema: {
            summary: 'Lista todos os membros cadastrados',
            tags: ["Membros"],
            response: {
                200: z.array(z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    email: z.string().email(),
                    empresa: z.string(),
                    telefone: z.string(),
                    cargo: z.string(),
                    status: z.string(),
                    createdAt: z.date(),
                }))
            }
        }
    }, async (request, reply) => {
        const members = await prisma.membro.findMany()
        return reply.status(200).send(members)
    })
}
