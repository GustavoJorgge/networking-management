import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function getEstatisticasIntencoesRoute(server: FastifyInstance) {
    server.withTypeProvider<ZodTypeProvider>().get(
        "/intencoes/estatisticas",
        {
            schema: {
                tags: ["Intenções"],
                summary: "Retorna intenções agrupadas por status",
                response: {
                    200: z.object({
                        pendentes: z.array(
                            z.object({
                                id: z.string(),
                                name: z.string(),
                                email: z.string(),
                                empresa: z.string().nullable(),
                                motivo: z.string().nullable(),
                                status: z.string(),
                            })
                        ),
                        aprovadas: z.array(
                            z.object({
                                id: z.string(),
                                name: z.string(),
                                email: z.string(),
                                empresa: z.string().nullable(),
                                motivo: z.string().nullable(),
                                status: z.string(),
                            })
                        ),
                        rejeitadas: z.array(
                            z.object({
                                id: z.string(),
                                name: z.string(),
                                email: z.string(),
                                empresa: z.string().nullable(),
                                motivo: z.string().nullable(),
                                status: z.string(),
                            })
                        ),
                    }),
                },
            },
        },
        async (_, reply) => {
            const [pendentes, aprovadas, rejeitadas] = await Promise.all([
                prisma.intencaoParticipar.findMany({ where: { status: "PENDENTE" } }),
                prisma.intencaoParticipar.findMany({ where: { status: "APROVADA" } }),
                prisma.intencaoParticipar.findMany({ where: { status: "REJEITADA" } }),
            ]);

            return reply.send({ pendentes, aprovadas, rejeitadas });
        }
    );
}
