import { FastifyInstance } from "fastify";
import {z} from 'zod';
import prisma from "@/infra/prisma/client";

export function createUserRoute(server: FastifyInstance) {
    server.post('/users',{
        schema:{
            summary: 'Cria um novo usuario',
            body: z.object({
                name: z.string(),
                email: z.string().email(),
                empresa: z.string(),
                motivo: z.string()
            }),
            response: {
                201: z.object({id: z.string().uuid()}),
                409: z.object({message: z.string().describe('Este e-mail ja esta cadastrado na base.')}),
                    
            }
        }
    },async (request, reply) => {
      
        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            empresa: z.string(),
            motivo: z.string()
        })

        const result = createUserBodySchema.safeParse(request.body)

        if (!result.success) {
            return reply.status(409).send(result.error)
        }

        const { name, email, empresa, motivo } = result.data

        const user = await prisma.user.create({
            data: {
                name,
                email,
                empresa,
                motivo
            }
        })

        return reply.status(201).send({ message: 'Usuário criado com sucesso', id: user.email});
    });
}
