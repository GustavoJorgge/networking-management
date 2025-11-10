import { FastifyInstance } from "fastify";
import { z } from "zod";
import prisma from "@/infra/prisma/client";
import { id } from "zod/v4/locales";

export function getComunicadosRoute(server: FastifyInstance) {
  server.get(
    "/comunicados",
    {
      schema: {
        summary: "Lista todos os comunicados cadastrados",
        tags: ["Comunicados"],
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              titulo: z.string(),
              conteudo: z.string(),
              autor: z.string(),
              criadoEm: z.string(),
              idMembro: z.string().uuid(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const comunicados = await prisma.comunicado.findMany({
        orderBy: { criadoEm: "desc" },
      });

      const response = comunicados.map((c) => ({
        id: c.id,
        titulo: c.titulo,
        conteudo: c.conteudo,
        autor: c.autor,
        criadoEm: c.criadoEm.toISOString(),
        idMembro: c.idMembro,
      }));

      return reply.status(200).send(response);
    }
  );
}
