import 'dotenv/config'
import fastify from 'fastify';
import {env} from "@/env"
import {fastifyCors} from '@fastify/cors'
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { createUserRoute } from './routes/create-user';
import { get } from 'http';
import { getUserRoute } from './routes/get-user';

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

server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Processo Seletivo AG Sistemas',
            description: 'API para gerenciamento de usuários e agendas',
            version: '1.0.0',
        },
    },
})

server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

server.register(createUserRoute)
server.register(getUserRoute)


console.log(env.DATABASE_URL)

server.listen({port:3333, host: '0.0.0.0'}).then(() => {
    console.log('Servidor rodando na porta 3333')
})