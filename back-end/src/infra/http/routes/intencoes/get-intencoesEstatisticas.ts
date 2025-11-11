import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";

export async function getEstatisticasIntencoesRoute(server: FastifyInstance) {
    server.get("/intencoes/estatisticas", {
        schema: {
            tags: ["Intenções"],
            summary: "Retorna contagem de intenções por status",
            response: {
                200: {
                    type: "object",
                    properties: {
                        pendentes: { type: "number" },
                        aprovadas: { type: "number" },
                        rejeitadas: { type: "number" },
                        total: { type: "number" },
                    },
                },
            },
        },
    }, async (_, reply) => {
        const [pendentes, aprovadas, rejeitadas, total] = await Promise.all([
            prisma.intencaoParticipar.count({ where: { status: "PENDENTE" } }),
            prisma.intencaoParticipar.count({ where: { status: "APROVADA" } }),
            prisma.intencaoParticipar.count({ where: { status: "REJEITADA" } }),
            prisma.intencaoParticipar.count(),
        ]);

        return reply.send({ pendentes, aprovadas, rejeitadas, total });
    });
}
