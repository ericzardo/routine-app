import prisma from "@lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { ForbiddenError } from "src/error-handler";
import auth from "src/middleware/auth";

interface UploadDocumentParams {
  profileId: string;
}

interface UploadDocumentProps {
  path: Array<{ id: string; name: string; type: string; modified: string }>;
}

async function uploadDocument (app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{ Params: UploadDocumentParams, Body: UploadDocumentProps }>(
      "/:profileId/documents/upload",
      {
        preHandler: [auth],
        schema: {
          params: z.object({
            profileId: z.string().uuid(),
          }),
          body: z.object({
            path: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                type: z.string(),
                modified: z.string(),
              })
            ),
          })
        },
      },
      async (request, reply) => {
        const { user } = request;
        const { profileId } = request.params;
        const { path } = request.body;
        const files = request.files();

        if (!user) {
          throw new ForbiddenError("Not authenticated.")
        }

        const profile = user.profiles?.find(p => p.id === profileId);
  
        if (!profile) {
          throw new ForbiddenError("Access to the specified profile is not allowed.");
        }
        
        const parentFolder = path.length > 0 ? await prisma.document.findUnique({
          where: {
            id: path[path.length - 1].id,
            profileId: profile.id,
          },
        }) : null;

        const documents = [];

        for await (const file of files) {
          const { filename, mimetype } = file;

          const type = mimetype.startsWith("image/") || mimetype.startsWith("video/")
            ? "FILE"
            : "FOLDER"

          const document = await prisma.document.create({
            data: {
              name: filename,
              type,
              modified: new Date(),
              parentId: parentFolder?.id, 
              profileId: profile.id,
            },
          });

          documents.push(document);
        }

        return reply.status(201).send({
          documents,
          message: `Upload documents successfully`,
        }); 
      }
    );
}

export default uploadDocument;
