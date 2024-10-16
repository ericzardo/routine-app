import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import prisma from "@lib/prisma";

import { ForbiddenError, NotFoundError } from "src/error-handler";
import auth from "src/middleware/auth";

interface AlarmParms {
  profileId: string
  alarmId: string
}

async function toggleAlarm (app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .patch<{ Params: AlarmParms }>(
      "/:profileId/alarms/:alarmId/toggle",
      {
        preHandler: [auth],
        schema: {
          params: z.object({
            profileId: z.string().uuid(),
            alarmId: z.string().uuid(),
          }),
        },
      },
      async (request, reply) => {
        const { user } = request;
        const { profileId, alarmId } = request.params;

        if (!user) {
          throw new ForbiddenError("Not authenticated.");
        }

        const profile = user.profiles?.find(p => p.id === profileId);

        if (!profile) {
          throw new ForbiddenError("Access to the specified profile is not allowed.");
        }

        const alarm = await prisma.alarm.findUnique({
          where: {
            id: alarmId,
            profileId: profile.id,
          },
        });

        if (!alarm) {
          throw new NotFoundError("Alarm not found.");
        }

        const updatedAlarm = await prisma.alarm.update({
          where: { id: alarmId },
          data: { isActive: !alarm.isActive },
        });

        return reply.status(200).send({
          alarm: updatedAlarm,
          message: `Alarm has been ${updatedAlarm.isActive ? "activated" : "deactivated"} successfully.`,
        });
      }
    );
}

export default toggleAlarm;
