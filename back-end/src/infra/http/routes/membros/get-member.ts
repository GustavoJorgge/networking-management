import { FastifyInstance } from "fastify";
import { z } from "zod";
import prisma from "@/infra/prisma/client";

export function getMemberRoute(server: FastifyInstance) {
  server.get(
    "/members",
    {
      schema: {
        tags: ["Membros"],
        summary: "Lista todos os membros cadastrados",
        description:
          "Retorna uma lista com todos os membros ativos e cadastrados no sistema, incluindo informações de identificação e vínculo empresarial.",

        response: {
          200: {
            description: "Lista de membros retornada com sucesso",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {type: "string"},
                name: {type: "string"},
                email: {type: "string",format: "email"},
                empresa: {type: "string"},
                motivo: {type: "string"},
                status: {type: "string"},
              },
            },
          },
          500: {
            description: "Erro interno ao buscar os membros",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Erro ao buscar membros no banco de dados.",
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
        
      try {
        const members = await prisma.membro.findMany();
        return reply.status(200).send(members);
      } catch (error) {
        console.error(error);
        return reply
          .status(500)
          .send({ message: "Erro ao buscar membros no banco de dados." });
      }
    }
  );
}
