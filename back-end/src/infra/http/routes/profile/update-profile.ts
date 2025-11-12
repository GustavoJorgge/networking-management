import { authenticate } from "@/infra/http/middleware/authenticate";
import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";

export function updateProfileRoute(server: FastifyInstance) {
    server.put(
        "/profile",
        {
            preHandler: [authenticate],
            schema: {
                summary: "Atualiza os dados do perfil do membro autenticado",
                tags: ["Membros"],
                body: z.object({
                    name: z.string().min(2, "Nome obrigatório").optional(),
                    empresa: z.string().optional(),
                    telefone: z.string().optional(),
                    cargo: z.string().optional(),
                }),
                response: {
                    200: z.object({
                        message: z.string(),
                        user: z.object({
                            id: z.string().uuid(),
                            name: z.string(),
                            email: z.string().email(),
                            empresa: z.string().nullable(),
                            telefone: z.string().nullable(),
                            cargo: z.string().nullable(),
                        }),
                    }),
                    404: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const userId = (request.user as any).id;
            const { name, empresa, telefone, cargo } = request.body as any;

            const member = await prisma.membro.findUnique({ where: { id: userId } });

            if (!member) {
                return reply.status(404).send({ message: "Usuário não encontrado" });
            }

            const updated = await prisma.membro.update({
                where: { id: userId },
                data: { name, empresa, telefone, cargo },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    empresa: true,
                    telefone: true,
                    cargo: true,
                },
            });

            return reply.status(200).send({
                message: "Perfil atualizado com sucesso",
                user: updated,
            });
        }
    );
}
