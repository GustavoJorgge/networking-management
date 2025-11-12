import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export function createComunicadoRoute(server: FastifyInstance) {
  server.post('/comunicados', {
    schema: {
      tags: ["Comunicados"],
      summary: 'Cria um novo comunicado',
      body: z.object({
        titulo: z.string(),
        conteudo: z.string(),
      }),
      response: {
        201: z.object({
          id: z.string().uuid(),
          titulo: z.string(),
          conteudo: z.string(),
          autor: z.string(),
          criadoEm: z.string(),
          idMembro: z.string().uuid()
        }),
        401: z.object({
          message: z.string().describe('Usuário não autenticado.')
        }),
        400: z.object({
          message: z.string().describe('Dados inválidos.')
        }),
        500: z.object({
          message: z.string().describe('Erro interno do servidor.')
        }),
      }
    }
  }, async (request, reply) => {
    const bodySchema = z.object({
      titulo: z.string(),
      conteudo: z.string(),
    });

    const result = bodySchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({ message: 'Dados inválidos.' });
    }

    const { titulo, conteudo } = result.data;

    try {
      // Extrai o ID do JWT (que você definiu como 'id' no login)
      const user = request.user as { id: string; email: string };
      const userId = user.id;

      // Busca o nome do usuário no banco
      const usuario = await prisma.membro.findUnique({
        where: { id: userId },
        select: { name: true }
      });

      if (!usuario) {
        return reply.status(401).send({ message: 'Usuário não encontrado.' });
      }

      const comunicado = await prisma.comunicado.create({
        data: {
          titulo,
          conteudo,
          autor: usuario.name,
          idMembro: userId,
          criadoEm: new Date()
        }
      });

      return reply.status(201).send({
        id: comunicado.id,
        titulo: comunicado.titulo,
        conteudo: comunicado.conteudo,
        autor: comunicado.autor,
        criadoEm: comunicado.criadoEm.toISOString(),
        idMembro: comunicado.idMembro
      });
    } catch (error) {
      console.error('Erro ao criar comunicado:', error);
      return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
  });
}