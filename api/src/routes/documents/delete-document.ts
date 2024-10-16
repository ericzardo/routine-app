import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ForbiddenError, NotFoundError } from "src/error-handler";
import { z } from "zod";
import auth from "src/middleware/auth";
import prisma from "@lib/prisma";

interface DocumentParms {
  profileId: string
  documentId: string
}

async function deleteDocument (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete<{ Params: DocumentParms }>(
    "/:profileId/documents/:documentId",
    {
      preHandler: [auth],
      schema: {
        params: z.object({
          profileId: z.string().uuid(),
          documentId: z.string().uuid(),
        })
      },
    },
    async (request, reply) => {
      const { user } = request;
      const { profileId, documentId } = request.params;

      if (!user) {
        throw new ForbiddenError("Not authenticated.")
      }

      const profile = user.profiles?.find(p => p.id === profileId);
  
      if (!profile) {
        throw new ForbiddenError("Access to the specified profile is not allowed.");
      }

      const document = await prisma.document.findUnique({
        where: {
          id: documentId,
          profileId: profile.id
        }
      })

      if (!document) {
        throw new NotFoundError("Document not found in the specified profile.");
      }

      await prisma.document.delete({
        where: {
          id: document.id
        }
      })

      return reply.status(201).send({
        document,
        message: `Document deleted successfully`,
      });
    },
  );
}

export default deleteDocument;
