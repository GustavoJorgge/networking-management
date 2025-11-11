import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";
import z from "zod";

export function deleteIntencaoRoute(server: FastifyInstance) {
    server.delete('/intencoes/:id', {
        schema: {
            tags: ["Intenções"],
            summary: 'Deleta uma intenção de participação pelo ID',
            params: z.object({
                id: z.string().uuid()
            }),
            response: {
                204: z.object({message: z.string().describe('Intenção deletada com sucesso.')}),
                404: z.object({ message: z.string().describe('Intenção não encontrada.') }),
                500: z.object({ message: z.string().describe('Erro interno do servidor.') }),
            }
        }
    }, async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });
        const { id } = paramsSchema.parse(request.params);

        try {
            const deleted = await prisma.intencaoParticipar.delete({
                where: { id }
            });

            if (!deleted) {
                return reply.status(404).send({ message: 'Intenção não encontrada.' });
            }

            return reply.status(204).send(null);
        } catch (error) {
            return reply.status(500).send({ message: 'Erro interno do servidor.' });
        }
    });
}