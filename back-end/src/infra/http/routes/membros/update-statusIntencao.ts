import { FastifyInstance } from "fastify";
import prisma from "@/infra/prisma/client";

export async function updateStatusIntencaoRoute(server: FastifyInstance) {
  server.put<{ Params: { id: string }; Body: { status: string } }>(
    "/intencoes/:id/status",
    {
      schema: {
        summary: "Atualiza o status de uma intenção para APROVADA ou REJEITADA -> Caso aprovada, cria um novo membro",
        tags: ["Intenções"],
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["APROVADA", "REJEITADA"] },
          },
          required: ["status"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
              data: { type: "object" },
            },
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const { status } = request.body;

        const intencao = await prisma.intencaoParticipar.findUnique({
          where: { id },
        });

        if (!intencao) {
          return reply.status(404).send({ message: "Intenção não encontrada." });
        }

        const updated = await prisma.intencaoParticipar.update({
          where: { id },
          data: { status },
        });

        if (status === "APROVADA") {
          await prisma.membro.create({
            data: {
              name: intencao.name,
              email: intencao.email,
              empresa: intencao.empresa,
              telefone: "",
              cargo: "",
              status: "Ativo",
            },
          });
        }

        return reply.status(200).send({
          message: `Intenção ${status.toLowerCase()} com sucesso.`,
          data: updated,
        });
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: "Erro ao atualizar status da intenção." });
      }
    }
  );
}
