import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import bcrypt from "bcrypt";
import prisma from "@lib/prisma";
import jwt from "jsonwebtoken";
import env from "@lib/env"

import { ClientErrpr } from "src/error-handler";

interface LoginSchema {
  email: string;
  password: string;
}

async function login (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post<{ Body: LoginSchema }>(
    "/auth/login",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await prisma.user.findFirst({
        where: { email },
      });

      if (!user) {
        throw new ClientErrpr("Incorrect password or email.");
      };

      const isCorrectPassword = bcrypt.compareSync(password, user.password);

      if (!isCorrectPassword) {
        throw new ClientErrpr("Incorrect password or email.");
      };

      const token = jwt.sign(
        {id: user.id },
        env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      reply.setCookie("token", token, {
        maxAge: 3600000,
        path: "/",
      });

      return reply.status(201).send({
        token,
        message: `Login successful`,
      });
    },
  );
}

export default login;
