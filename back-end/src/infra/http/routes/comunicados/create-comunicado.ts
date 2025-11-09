import {FastifyInstance} from "fastify"
import {z} from "zod"
import prisma from "@/infra/prisma/client"

export function createComunicadoRoute(server: FastifyInstance) {
    server.post('/comunicados', {
        schema: {
            tags: ["Comunicados"],
            summary: 'Cria um novo comunicado',
            body: z.object({
                titulo: z.string(),
                conteudo: z.string(),
                autor: z.string()
            }),
            response: {
                201: z.object({id: z.string().uuid(),titulo: z.string(), conteudo: z.string(), autor: z.string(), criadoEm: z.string()}),
                403: z.object({ message: z.string().describe('Usuário sem permissão para criar comunicados.') }),
                500: z.object({ message: z.string().describe('Erro interno do servidor.') }),
            }
        }
    }, async (request, reply) => {

        const newComunicadoSchema = z.object({
            titulo: z.string(),
            conteudo: z.string(),
            autor: z.string(),
            criadoEm: z.string().default(new Date().toISOString()), 
        })
        const result = newComunicadoSchema.safeParse(request.body)



        if (!result.success) {
            return reply.status(403).send(result.error)
        }
            
          const { titulo, conteudo, autor, criadoEm } = result.data
          const comunicado = await prisma.comunicado.create({
            data: {
                titulo,
                conteudo,
                autor,
                criadoEm: new Date(criadoEm),
            }
          })   
        return reply.status(201).send(comunicado)
    });
}