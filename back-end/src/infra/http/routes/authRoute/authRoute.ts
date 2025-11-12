import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export async function loginRoute(server: FastifyInstance) {
    server.post("/login", {
        schema: {
            tags: ["Auth"],
            summary: "Login com JWT via e-mail",
            body: z.object({
                email: z.string().email(),
            }),
            response: {
                200: z.object({
                    message: z.string(),
                    token: z.string(),
                    user: z.object({
                        id: z.string(),
                        name: z.string(),
                        email: z.string(),
                    }),
                }),
                401: z.object({
                    message: z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        const { email } = request.body as { email: string };

        const membro = await prisma.membro.findUnique({
            where: { email },
            select: { id: true, name: true, email: true },
        });

        if (!membro) {
            return reply.status(401).send({ message: "Usuário não encontrado" });
        }

        // Gera o token JWT
        const token = server.jwt.sign(
            { id: membro.id, email: membro.email },
            { expiresIn: "1d" } // expira em 1 dia
        );

        return reply.send({
            message: "Login realizado com sucesso",
            token,
            user: membro,
        });
    });
}
