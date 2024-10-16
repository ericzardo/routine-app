import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ForbiddenError, NotFoundError } from "src/error-handler";
import { z } from "zod"
import prisma from "@lib/prisma";
import auth from "src/middleware/auth";

interface RenameDocumentProps {
  name: string;
}

interface RenameDocumentParams {
  documentId: string;
  profileId: string;
}

async function renameDocument (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch<{ Body: RenameDocumentProps, Params: RenameDocumentParams }>(
    "/:profileId/documents/:documentId/rename",
    {
      preHandler: [auth],
      schema: {
        body: z.object({
          name: z.string().min(3).max(24),
        }),
        params: z.object({
          documentId: z.string().uuid(),
          profileId: z.string().uuid(),
        })
      },
    },
    async (request, reply) => {
      const { user } = request;
      const { documentId, profileId } = request.params;
      const { name } = request.body;

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
        },
      });

      if (!document) {
        throw new NotFoundError("Document not found in the specified profile.");
      }

      const updatedDocument = await prisma.document.update({
        where: { id: document.id },
        data: { name },
      });

      return reply.status(201).send({
        document: updatedDocument,
        message: `User Profiles sent successfully`,
      });
    },
  );
}

export default renameDocument;
