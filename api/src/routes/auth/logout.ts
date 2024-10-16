import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { ForbiddenError } from "src/error-handler";
import auth from "src/middleware/auth";

async function logout (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/auth/logout",
    {
      preHandler: [auth]
    },
    async (request, reply) => {
      const { user } = request;

      if (!user) {
        throw new ForbiddenError("Not authenticated.")
      };

      reply.clearCookie("token", {
        path: "/",
      });

      return reply.status(201).send({
        message: `Logout successful`,
      });
    },
  );
}

export default logout;
