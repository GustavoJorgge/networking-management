import { FastifyInstance } from "fastify";
import {z} from 'zod';

export function createUserRoute(server: FastifyInstance) {
    server.post('/users',{
        schema:{
            summary: 'Cria um novo usuario',
            body: z.object({
                name: z.string(),
                email: z.string().email()
            }),
            response: {
                201: z.object({id: z.string().uuid()}),
                409: z.object({message: z.string().describe('Este e-mail ja esta cadastrado na base.')}),
                    
            }
        }
    },(request, reply) => {
        return reply.status(201).send({id: 'some-uuid' });
    });
}
