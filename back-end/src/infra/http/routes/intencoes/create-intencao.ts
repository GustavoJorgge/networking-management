import { FastifyInstance } from "fastify";
import {z} from 'zod';
import prisma from "@/infra/prisma/client";

export function createIntencaoRoute(server: FastifyInstance) {
    server.post('/intencoes', {
        schema: {
            tags: ["Intenções"],
            summary: 'Cria uma nova intenção de participação',
            description: 'Cria um novo registro de intenção de participação.',
            body: {
                type: 'object',
                required: ['name', 'email', 'empresa', 'motivo'],
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    empresa: { type: 'string' },
                    motivo: { type: 'string' },
                }
            },
            response: {
                201: {
                    description: 'Intenção criada com sucesso!',
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string', 
                            example: 'Intenção de ser membro criada com sucesso'
                        },
                        id: {
                            type: 'string', 
                            format: 'uuid', 
                            example: '4e54c9b6-7f3a-4a3e-a7e2-3b5e2b5c9d12'
                        },
                }
                }
                ,
                409: {
                    description: 'E-mail cadastrado na base.',
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'E-mail já cadastrado na base de intenções.' }
                    }
                },
                500: {
                    description: 'Erro interno ao criar a intenção',
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Erro interno no servidor' }
                    }
                }
            }
        }
    },async (request, reply) => {

        const newIntencaoSchema = z.object({
            name: z.string(),
            email: z.string().email(),
            empresa: z.string(),
            motivo: z.string(),
            status: z.string().default('Pendente'),
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

        return reply.status(201).send({ message: 'Intenção de ser membro criada com sucesso', id: user.id});
    });
}
