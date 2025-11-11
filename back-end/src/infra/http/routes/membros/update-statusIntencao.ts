import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import prisma from '@/infra/prisma/client';

export function updateStatusIntencaoRoute(server: FastifyInstance) {
  server.put('/intencoes/:id/status', {
    schema: {
      summary: 'Atualiza o status de uma intenção para APROVADA ou REJEITADA. Caso aprovada, cria um novo membro.',
      tags: ['Intenções'],
      params: z.object({
        id: z.string().uuid()
      }),
      body: z.object({
        status: z.enum(['APROVADA', 'REJEITADA'])
      }),
      response: {
        200: z.object({
          message: z.string(),
          data: z.object({
            id: z.string().uuid(),
            name: z.string(),
            email: z.string().email(),
            empresa: z.string(),
            motivo: z.string(),
            status: z.string(),
            createdAt: z.date(),
          })
        }),
        404: z.object({
          message: z.string().describe('Intenção não encontrada.')
        }),
        500: z.object({
          message: z.string().describe('Erro interno do servidor.')
        })
      }
    }
  }, async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    const bodySchema = z.object({
      status: z.enum(['APROVADA', 'REJEITADA'])
    });

    const { id } = paramsSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    try {
      const intencao = await prisma.intencaoParticipar.findUnique({
        where: { id }
      });

      if (!intencao) {
        return reply.status(404).send({ message: 'Intenção não encontrada.' });
      }

      const updated = await prisma.intencaoParticipar.update({
        where: { id },
        data: { status }
      });

      if (status === 'APROVADA') {
        await prisma.membro.create({
          data: {
            name: intencao.name,
            email: intencao.email,
            empresa: intencao.empresa,
            telefone: '',
            cargo: '',
            status: 'Ativo',
            createdAt: new Date()
          }
        });
      }

      return reply.status(200).send({
        message: `Intenção ${status.toLowerCase()} com sucesso.`,
        data: updated
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
  });
}
