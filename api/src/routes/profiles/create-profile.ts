import prisma from "@lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { ForbiddenError } from "src/error-handler";
import auth from "src/middleware/auth";

interface ProfileSchema {
  name: string;
}

async function createProfile (app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{ Body: ProfileSchema }>(
      "/profiles",
      {
        preHandler: [auth],
        schema: {
          body: z.object({
            name: z.string().min(3).max(24),
          }),
        },
      },
      async (request, reply) => {
        const { user } = request;
        const { name } = request.body;

        if (!user) {
          throw new ForbiddenError("Not authenticated.")
        }

        const profile = await prisma.profile.create({
          data: {
            userId: user.id,
            name,
          },
        });

        return reply.status(201).send({
          profile: profile.id,
          message: `Profile created successfully`,
        });
      }
    );
}

export default createProfile;
