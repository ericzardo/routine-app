import prisma from "@lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { ForbiddenError } from "src/error-handler";
import auth from "src/middleware/auth";

interface AlarmSchema {
  name: string;
  time: string;
  sound: string;
  repeat: string;
  isActived?: boolean;
}

interface CreateAlarmParams {
  profileId: string;
}

async function createAlarm (app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post<{ Body: AlarmSchema, Params: CreateAlarmParams }>(
      "/:profileId/alarms",
      {
        preHandler: [auth],
        schema: {
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
            isActived: z.boolean(),
          }),
          params: z.object({
            profileId: z.string().uuid(),
          })
        },
      },
      async (request, reply) => {
        const { user } = request;
        const { profileId } = request.params;
        const { name, time, sound, repeat, isActived } = request.body;

        if (!user) {
          throw new ForbiddenError("Not authenticated.")
        }

        const profile = user.profiles?.find(p => p.id === profileId);
  
        if (!profile) {
          throw new ForbiddenError("Access to the specified profile is not allowed.");
        }

        const alarm = await prisma.alarm.create({
          data: {
            name,
            time: new Date(`1970-01-01T${time}:00`),
            sound: sound || "Default",
            repeat: repeat,
            isActive: isActived ?? true,
            profile: {
              connect: { id: profileId },
            },
          },
        });

        return reply.status(201).send({
          alarm,
          message: `Alarm created successfully`,
        }); 
      }
    );
}

export default createAlarm;
