import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ForbiddenError } from "src/error-handler";
import { z } from "zod";
import auth from "src/middleware/auth";
import prisma from "@lib/prisma";

interface DocumentsParams {
  profileId: string
}

async function getDocuments (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get<{ Params: DocumentsParams}>(
    "/:profileId/documents",
    {
      preHandler: [auth],
      schema: {
        params: z.object({
          profileId: z.string().uuid(),
        })
      }
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

      const documents = await prisma.document.findMany({
        where: {
          profileId: profile.id
        },
        include: {
          content: true
        }
      })

      return reply.status(201).send({
        documents,
        message: `Documents sent successfully`,
      });
    },
  );
}

export default getDocuments;
