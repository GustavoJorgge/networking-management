import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";
import z from "zod";

export function getMemberByEmailRoute(server: FastifyInstance) {
    server.get('/members/email/:email', {
        schema: {
            summary: 'Obtém um membro pelo email',
            tags: ["Membros"],
            params: z.object({
                email: z.string().email()
            }),
            response: {
                200: z.object({
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
            email: z.string().email()
        });
        const params = paramsSchema.parse(request.params);

        const member = await prisma.membro.findUnique({
            where: { email: params.email }
        });
        if (!member) {
            return reply.status(404).send({ message: 'Membro não encontrado.' });
        }
        return reply.status(200).send(member);
    });
}