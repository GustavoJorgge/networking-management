import { authenticate } from "@/infra/http/middleware/authenticate";
import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function getProfileRoute(server: FastifyInstance) {
    server.get("/profile", {
        preHandler: [authenticate],
        schema: {
            tags: ["Profile"],
            summary: "Obtém o perfil do usuário autenticado",
            response: {
                200: z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    email: z.string().email(),
                    empresa: z.string().nullable(),
                    cargo: z.string().nullable(),
                    telefone: z.string().nullable(),
                    status: z.string(),
                    createdAt: z.string(),
                }),
                404: z.object({
                    message: z.string()
                })
            }
        }
    }, async (request, reply) => {
        const userId = (request.user as any).id;

        const user = await prisma.membro.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                empresa: true,
                cargo: true,
                telefone: true,
                status: true,
                createdAt: true,
            },
        });

        if (!user) {
            return reply.status(404).send({ message: "Usuário não encontrado" });
        }

        return reply.send({
            ...user,
            createdAt: user.createdAt.toISOString()
        });
    });
}