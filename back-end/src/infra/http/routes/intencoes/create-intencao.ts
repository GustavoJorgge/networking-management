import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";
import { z } from 'zod';

export function createIntencaoRoute(server: FastifyInstance) {
    server.post('/intencoes', {
        schema: {
            tags: ["Intenções"],
            summary: 'Cria uma nova intenção de participação',
            body: z.object({
                name: z.string(),
                email: z.string().email(),
                empresa: z.string(),
                motivo: z.string()
            }),
            response: {
                201: z.object({ id: z.string().uuid(), message: z.string() }),
                409: z.object({ message: z.string().describe('Este e-mail ja esta cadastrado na base.') }),

            }
        }
    }, async (request, reply) => {

        const newIntencaoSchema = z.object({
            name: z.string(),
            email: z.string().email(),
            empresa: z.string(),
            motivo: z.string(),
            status: z.string().default('PENDENTE'),
        })

        const result = newIntencaoSchema.safeParse(request.body)

        if (!result.success) {
            return reply.status(409).send(result.error)
        }

        const { name, email, empresa, motivo, status } = result.data

        const user = await prisma.intencaoParticipar.create({
            data: {
                name,
                email,
                empresa,
                motivo,
                status

            }
        })

        return reply.status(201).send({ message: 'Intenção de ser membro criada com sucesso', id: user.id });
    });
}
