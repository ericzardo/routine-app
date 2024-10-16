import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ForbiddenError } from "src/error-handler";
import auth from "src/middleware/auth";

async function getProfiles (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/auth",
    {
      preHandler: [auth],
    },
    async (request, reply) => {
      const { user } = request;

      if (!user) {
        throw new ForbiddenError("Not authenticated.")
      }
      
      return reply.status(201).send({
        user,
        message: `User authenticated successfully`,
      });
    },
  );
}

export default getProfiles;
