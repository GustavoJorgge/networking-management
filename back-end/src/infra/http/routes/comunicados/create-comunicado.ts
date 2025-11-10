import { FastifyInstance } from "fastify";
import { z } from "zod";
import prisma from "@/infra/prisma/client";

export function createComunicadoRoute(server: FastifyInstance) {
  server.post('/comunicados', {
    schema: {
      tags: ["Comunicados"],
      summary: 'Cria um novo comunicado',
      body: z.object({
        titulo: z.string(),
        conteudo: z.string(),
        autor: z.string(),
        idMembro: z.string().uuid().optional()
      }),
      response: {
        201: z.object({
          id: z.string().uuid(),
          titulo: z.string(),
          conteudo: z.string(),
          autor: z.string(),
          criadoEm: z.string(),
          idMembro: z.string().uuid().nullable()
        }),
        403: z.object({
          message: z.string().describe('Usuário sem permissão para criar comunicados.')
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
      autor: z.string(),
      idMembro: z.string().uuid()
    });

    const result = bodySchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(403).send({ message: 'Dados inválidos.' });
    }

    const { titulo, conteudo, autor, idMembro } = result.data;

    try {
      const comunicado = await prisma.comunicado.create({
        data: {
          titulo,
          conteudo,
          autor,
          idMembro,
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
      console.error(error);
      return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
  });
}
