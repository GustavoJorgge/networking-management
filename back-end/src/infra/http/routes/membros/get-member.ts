import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '@/infra/prisma/client';


export function getMemberRoute(server: FastifyInstance) {
    server.get('/members', {
        schema: {
            summary: 'Lista todos os membros cadastrados',
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
        const members = await prisma.intencaoParticipar.findMany()
        return reply.status(200).send(members)
    })
}
