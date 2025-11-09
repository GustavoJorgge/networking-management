import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '@/infra/prisma/client';

export function getMemberByIdRoute(server: FastifyInstance) {
    server.get('/members/:id', {
        schema: {
            summary: 'Obtém um membro pelo ID',
            tags: ["Membros"],
            params: z.object({
                id: z.string()
            }),
            response: {
                201: z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string().email(),
                    empresa: z.string(),
                    telefone: z.string(),
                    cargo: z.string(),
                    status: z.string()
                }),
                404: z.object({ message: z.string().describe('Membro não encontrado.') }),
                500: z.object({ message: z.string().describe('Erro interno do servidor.') }),
            }
        }
    }, async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });

        const params = paramsSchema.parse(request.params);

        const member = await prisma.membro.findUnique({
            where: { id: params.id }
        });

        if (!member) {
            return reply.status(404).send({ message: 'Membro não encontrado.' });
        }

        return reply.status(201).send(member);
    });
}