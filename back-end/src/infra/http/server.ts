import fastify from 'fastify';
import {env} from "@/env"
import {fastifyCors} from '@fastify/cors'
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
 if(hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
        message: 'Erro de validação', 
        issues: error.validation
    })
}

    console.log(error)


    return reply.status(500).send({message: 'Erro interno no servidor'})
})

server.register(fastifyCors, {origin: '*'})

console.log(env.DATABASE_URL)

server.listen({port:3333, host: '0.0.0.0'}).then(() => {
    console.log('Servidor rodando na porta 3333')
})