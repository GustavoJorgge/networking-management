import { FastifyInstance } from "fastify";
import { z } from "zod";
import prisma from "@/infra/prisma/client";
import { create } from "domain";

export async function createMemberRoute(server: FastifyInstance) {
  server.post("/members", {
    schema: {
      summary: "Cria um novo membro",
      tags: ["Membros"],
      body: z.object({
        name: z.string(),
        email: z.string().email(),
        empresa: z.string(),
        telefone: z.string(),
        cargo: z.string(),
        createdAt: z.date().default(new Date()),
      }),
    },
  }, async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      empresa: z.string(),
      telefone: z.string(),
      cargo: z.string(),
      createdAt: z.date().default(new Date()),
    });

    const { name, email, empresa, telefone, cargo, createdAt } = bodySchema.parse(request.body);

    const member = await prisma.membro.create({
      data: {
        name,
        email,
        empresa,
        telefone,
        cargo,
        status: "Ativo",
        createdAt,
      },
    });

    return reply.status(201).send({ message: 'Membro criado com sucesso', id: member.id });
  });
}
