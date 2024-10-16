import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ForbiddenError, NotFoundError } from "src/error-handler";
import { z } from "zod";
import auth from "src/middleware/auth";
import prisma from "@lib/prisma";

interface AlarmParms {
  profileId: string
  alarmId: string
}

async function deleteAlarm (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete<{ Params: AlarmParms }>(
    "/:profileId/alarms/:alarmId",
    {
      preHandler: [auth],
      schema: {
        params: z.object({
          profileId: z.string().uuid(),
          alarmId: z.string().uuid(),
        })
      },
    },
    async (request, reply) => {
      const { user } = request;
      const { profileId, alarmId } = request.params;

      if (!user) {
        throw new ForbiddenError("Not authenticated.")
      }

      const profile = user.profiles?.find(p => p.id === profileId);
  
      if (!profile) {
        throw new ForbiddenError("Access to the specified profile is not allowed.");
      }

      const alarm = await prisma.alarm.findUnique({
        where: {
          id: alarmId
        }
      })

      if (!alarm) {
        throw new NotFoundError("Alarm not found in the specified profile.")
      }

      await prisma.alarm.delete({
        where: {
          id: alarm.id
        }
      })

      return reply.status(201).send({
        alarm,
        message: `Alarms deleted successfully`,
      });
    },
  );
}

export default deleteAlarm;
