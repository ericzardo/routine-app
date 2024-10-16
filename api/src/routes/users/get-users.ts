import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import prisma from "../../lib/prisma";

async function getUsers (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get("/users", async (_, reply) => {
    const users = await prisma.user.findMany({
      include: {
        profiles: true,
      },
    });

    return reply.status(201).send({
      users,
      message: `User sent successfully`,
    });
  });
}

export default getUsers;
