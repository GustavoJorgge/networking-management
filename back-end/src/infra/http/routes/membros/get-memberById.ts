import prisma from '@/infra/prisma/client';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export function getMemberByIdRoute(server: FastifyInstance) {
    server.withTypeProvider<ZodTypeProvider>().get('/members/:id', {
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
                    status: z.string(),
                    createdAt: z.date(),
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

        return reply.status(201).send({
            id: member.id,
            name: member.name,
            email: member.email,
            empresa: member.empresa,
            telefone: member.telefone ?? '',
            cargo: member.cargo ?? '',
            status: member.status,
            createdAt: member.createdAt,
        });
    });
}