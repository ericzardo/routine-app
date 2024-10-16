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

interface AlarmSchema {
  name: string;
  time: string;
  sound: string;
  repeat: string;
  isActived?: boolean;
}

async function editAlarm (app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .patch<{ Params: AlarmParms; Body: AlarmSchema }>(
      "/:profileId/alarms/:alarmId",
      {
        preHandler: [auth],
        schema: {
          params: z.object({
            profileId: z.string().uuid(),
            alarmId: z.string().uuid(),
          }),
          body: z.object({
            name: z.string().min(1, "The Alarm Name is required."),
            time: z
              .string()
              .regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format")
              .refine(time => {
                const [hour, minute] = time.split(":").map(Number);
                return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
              }, "Invalid time"),
            repeat: z.string().default(""),
            sound: z.string().optional(),
            isActived: z.boolean().optional(),
          }),
        },
      },
      async (request, reply) => {
        const { user } = request;
        const { profileId, alarmId } = request.params;
        const { name, time, sound, repeat, isActived } = request.body;

        if (!user) {
          throw new ForbiddenError("Not authenticated.");
        }

        const profile = user.profiles?.find(p => p.id === profileId);

        if (!profile) {
          throw new ForbiddenError("Access to the specified profile is not allowed.");
        }

        const alarm = await prisma.alarm.findFirst({
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
          data: {
            name,
            time: new Date(`1970-01-01T${time}:00`),
            sound: sound || alarm.sound,
            repeat: repeat,
            isActive: isActived !== undefined ? isActived : alarm.isActive,
          },
        });

        return reply.status(200).send({
          alarm: updatedAlarm,
          message: `Alarm updated successfully.`,
        });
      }
    );
}

export default editAlarm;
