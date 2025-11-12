import { env } from "@/env";
import { fastifyCors } from '@fastify/cors';
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import 'dotenv/config';
import fastify from 'fastify';
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler
} from 'fastify-type-provider-zod';

import { loginRoute } from "./routes/authRoute/authRoute";
import { createComunicadoRoute } from './routes/comunicados/create-comunicado';
import { getComunicadosRoute } from './routes/comunicados/get-comunicados';
import { createIntencaoRoute } from './routes/intencoes/create-intencao';
import { deleteIntencaoRoute } from './routes/intencoes/delete-intencao';
import { getIntencoesRoute } from './routes/intencoes/get-intencoes';
import { getEstatisticasIntencoesRoute } from "./routes/intencoes/get-intencoesEstatisticas";
import { createMemberRoute } from './routes/membros/create-member';
import { getMemberRoute } from './routes/membros/get-member';
import { getMemberByEmailRoute } from "./routes/membros/get-memberByEmail";
import { getMemberByIdRoute } from './routes/membros/get-memberById';
import { updateStatusIntencaoRoute } from './routes/membros/update-statusIntencao';
import { getProfileRoute } from "./routes/profile/get-profile";
import { updateProfileRoute } from "./routes/profile/update-profile";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.register(fastifyCors, { origin: '*' });

server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "super-secret-key",
});

server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Processo Seletivo AG Sistemas',
            description: 'API para gerenciamento de usuários e agendas',
            version: '1.0.0',
        },
    },
    transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

// Middleware de autenticação
server.addHook("onRequest", async (request, reply) => {
    const publicRoutes = ["/login", "/intencoes", "/docs"];

    if (publicRoutes.some((route) => request.url.startsWith(route))) {
        return;
    }

    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.status(401).send({ message: "Token inválido ou ausente" });
    }
});

// Rotas públicas
server.register(loginRoute);
server.register(createIntencaoRoute);

// Rotas de Intencoes
server.register(getIntencoesRoute);
server.register(deleteIntencaoRoute);
server.register(getEstatisticasIntencoesRoute);

// Rotas de Membros
server.register(getMemberRoute);
server.register(createMemberRoute);
server.register(updateStatusIntencaoRoute);
server.register(getMemberByIdRoute);
server.register(getMemberByEmailRoute);

// Rotas de Comunicados
server.register(createComunicadoRoute);
server.register(getComunicadosRoute);

// Rotas de Perfil
server.register(getProfileRoute)
server.register(updateProfileRoute)

console.log(env.DATABASE_URL);

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log('Servidor rodando na porta 3333');
});
