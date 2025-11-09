import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export function getIntencoesRoute(server: FastifyInstance) {
  server.get(
    "/intencoes",
    {
      schema: {
        tags: ["Intenções"],
        summary: "Lista todas as intenções de participação",
        description:
          "Retorna uma lista contendo todas as intenções de participação.",
        response: {
          200: {
            description: "Lista de intenções retornada com sucesso",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
                empresa: {
                  type: "string",
                },
                motivo: {
                  type: "string",
                },
                status: {
                  type: "string",
                },
              },
            },
          },
          500: {
            description: "Erro interno ao buscar as intenções",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Erro ao buscar intenções no banco de dados.",
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const intencoes = await prisma.intencaoParticipar.findMany();
        return reply.status(200).send(intencoes);
      } catch (error) {
        console.error(error);
        return reply
          .status(500)
          .send({ message: "Erro interno no servidor" });
      }
    }
  );
}
