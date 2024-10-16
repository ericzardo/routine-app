import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ForbiddenError, NotFoundError } from "src/error-handler";
import prisma from "@lib/prisma";
import z from "zod";

import auth from "src/middleware/auth";

interface MoveDocumentParams {
  documentId: string;
}

interface MoveDocumentBody {
  profileId: string
  parentId: string | null;
}

async function moveDocument (app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{ Params: MoveDocumentParams; Body: MoveDocumentBody }>(
      "/documents/:documentId/move",
      {
        preHandler: [auth],
        schema: {
          params: z.object({
            documentId: z.string().uuid(),
          }),
          body: z.object({ 
            profileId: z.string().uuid(),
            parentId: z.string().uuid().nullable(),
          }),
        },
      },
      async (request, reply) => {
        const { user } = request;
        const { documentId } = request.params;
        const { parentId, profileId: destinationProfileId } = request.body;

        if (!user) {
          throw new ForbiddenError("Not authenticated.");
        }

        const destinationProfile = user.profiles?.find(p => p.id === destinationProfileId);

        if (!destinationProfile) {
          throw new ForbiddenError("Access to the specified profile is not allowed.");
        }

        const document = await prisma.document.findUnique({
          where: {
            id: documentId,
          },
        });

        if (!document) {
          throw new NotFoundError("Document not found in the specified profile.");
        }

        let parentFolder = null;
        if (parentId) {
          parentFolder = await prisma.document.findUnique({
            where: {
              id: parentId,
            },
          });

          if (!parentFolder) {
            throw new NotFoundError("Destination folder not found.");
          }
        }

        const updatedDocument = await prisma.document.update({
          where: {
            id: documentId,
          },
          data: {
            parentId: !parentId ? null : parentFolder?.id,
            profileId: destinationProfile.id,
          },
        });

        return reply.status(200).send({
          document: updatedDocument,
          message: "Document moved successfully.",
        });
      }
    );
}

export default moveDocument;
