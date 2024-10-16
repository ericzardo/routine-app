import prisma from "@lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { ForbiddenError } from "src/error-handler";
import auth from "src/middleware/auth";

interface CreateFolderParams {
  profileId: string;
}

interface CreateFolderProps {
  path: Array<{ id: string; name: string; type: string; modified: string }>;
  name: string;
}

async function createFolder (app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{ Params: CreateFolderParams, Body: CreateFolderProps }>(
      "/:profileId/documents/create",
      {
        preHandler: [auth],
        schema: {
          params: z.object({
            profileId: z.string().uuid(),
          }),
          body: z.object({
            name: z.string().min(3).max(24),
            path: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                type: z.string(),
                modified: z.string(),
              }).optional()
            ).default([]),
          })
        },
      },
      async (request, reply) => {
        const { user } = request;
        const { profileId } = request.params;
        const { path, name } = request.body;

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

        const folder = await prisma.document.create({
          data: {
            name,
            type: "FOLDER",
            modified: new Date(),
            parentId: parentFolder?.id || null,
            profileId: profile.id,
            content: {
              create: []
            }
          },
        });

        return reply.status(201).send({
          folder,
          message: `Folder created successfully`,
        }); 
      }
    );
}

export default createFolder;
