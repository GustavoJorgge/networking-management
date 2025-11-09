import { FastifyInstance } from "fastify";
import { z } from "zod";
import prisma from "@/infra/prisma/client";

export async function createMemberRoute(server: FastifyInstance) {
  server.post(
    "/members",
    {
      schema: {
        tags: ["Membros"],
        summary: "Cria um novo membro",
        description:
          "Cria um novo registro de membro ativo no sistema.",
        body: {
          type: "object",
          required: ["name", "email", "empresa", "telefone", "cargo"],
          properties: {
            name: {type: "string",},
            email: {type: "string",format: "email",},
            empresa: {type: "string"},
            telefone: {type: "string"},
            cargo: {type: "string"},
          },
        },
        response: {
          201: {
            description: "Membro criado com sucesso",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Membro criado com sucesso",
              },
              id: {
                type: "string",
                format: "uuid",
                example: "4e54c9b6-7f3a-4a3e-a7e2-3b5e2b5c9d12",
              },
            },
          },
          500: {
            description: "Erro interno ao criar o membro",
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Erro interno no servidor",
              },
            },
          },
        },
      },
    },

    async (request, reply) => {
      const bodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        empresa: z.string(),
        telefone: z.string(),
        cargo: z.string(),
      });

      try {
        const { name, email, empresa, telefone, cargo } = bodySchema.parse(request.body);

        const member = await prisma.membro.create({
          data: {
            name,
            email,
            empresa,
            telefone,
            cargo,
            status: "Ativo",
          },
        });

        return reply.status(201).send({
          message: "Membro criado com sucesso",
          id: member.id,
        });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({
          message: "Erro interno no servidor",
        });
      }
    }
  );
}