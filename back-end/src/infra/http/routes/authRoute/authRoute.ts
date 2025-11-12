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

        const emailTeste = "agsistemas@teste.com";

        let membro = null;
        /* Coloquei este trecho de código para vocês testarem o login sem precisar criar o membro no banco no primeiro acesso*/
        if (email === emailTeste) {
            membro = {
                id: "00000000-0000-0000-0000-000000000000",
                name: "Usuário Teste AG Sistemas",
                email: emailTeste,
            };
        } else {
            membro = await prisma.membro.findUnique({
                where: { email },
                select: { id: true, name: true, email: true },
            });
        }

        if (!membro) {
            return reply.status(401).send({ message: "Usuário não encontrado" });
        }

        const token = server.jwt.sign(
            { id: membro.id, email: membro.email },
            { expiresIn: "1d" }
        );

        return reply.send({
            message: "Login realizado com sucesso",
            token,
            user: membro,
        });
    });
}
