import { authenticate } from "@/infra/http/middleware/authenticate";
import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";

export async function getProfileRoute(server: FastifyInstance) {
    server.get("/profile", { preHandler: [authenticate] }, async (request, reply) => {
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

        return reply.send(user);
    });

}
