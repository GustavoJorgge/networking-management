import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export function deleteComunicadoRoute(server: FastifyInstance) {
    server.withTypeProvider<ZodTypeProvider>().delete('/comunicados/:id', {
        schema: {
            tags: ["Comunicados"],
            summary: 'Deleta um comunicado pelo ID',
            params: z.object({
                id: z.string().uuid()
            }),
            response: {
                204: z.null(),
                404: z.object({
                    message: z.string().describe('Comunicado não encontrado.')
                }),
                500: z.object({
                    message: z.string().describe('Erro interno do servidor.')
                }),
            }
        }
    }, async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });
        const { id } = paramsSchema.parse(request.params);
        try {
            const comunicado = await prisma.comunicado.findUnique({
                where: { id }
            });
            if (!comunicado) {
                return reply.status(404).send({ message: 'Comunicado não encontrado.' });
            }
            await prisma.comunicado.delete({
                where: { id }
            });
            return reply.status(204).send();
        } catch (error) {
            return reply.status(500).send({ message: 'Erro interno do servidor.' });
        }
    });
}