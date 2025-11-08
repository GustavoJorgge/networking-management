import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '@/infra/prisma/client';


export function getUserRoute(server: FastifyInstance) {
    server.get('/users', {
        schema: {
            summary: 'Lista todos os usuários',
            response: {
                200: z.array(z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    email: z.string().email(),
                    empresa: z.string(),
                    motivo: z.string()
                }))
            }
        }
    }, async (request, reply) => {
        const users = await prisma.user.findMany()
        return reply.status(200).send(users)
    })
}
