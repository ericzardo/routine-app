import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ForbiddenError } from "src/error-handler";
import { z } from "zod";
import auth from "src/middleware/auth";
import prisma from "@lib/prisma";

interface ProfilesParams {
  profileId: string
}

async function deleteProfile (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete<{ Params: ProfilesParams }>(
    "/profiles/:profileId",
    {
      preHandler: [auth],
      schema: {
        params: z.object({
          profileId: z.string().uuid(),
        })
      },
    },
    async (request, reply) => {
      const { user } = request;
      const { profileId } = request.params;

      if (!user) {
        throw new ForbiddenError("Not authenticated.")
      }

      const profile = user.profiles?.find(p => p.id === profileId);
  
      if (!profile) {
        throw new ForbiddenError("Access to the specified profile is not allowed.");
      }

      await prisma.profile.delete({
        where: {
          id: profile.id
        }
      })

      return reply.status(201).send({
        profile,
        message: `Profile ${profile.name} deleted successfully`,
      });
    },
  );
}

export default deleteProfile;
