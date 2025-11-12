import prisma from "@/infra/prisma/client";
import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function authRoute(server: FastifyInstance) {
    server.post("/login", async (req, reply) => {
        const bodySchema = z.object({
            email: z.string().email(),
        });

        const { email } = bodySchema.parse(req.body);

        const membro = await prisma.membro.findUnique({ where: { email } });

        if (!membro) {
            return reply.status(401).send({ message: "Acesso negado. Membro não encontrado." });
        }

        const token = jwt.sign(
            { id: membro.id, email: membro.email, name: membro.name },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return reply.send({ token, membro });
    });
}
