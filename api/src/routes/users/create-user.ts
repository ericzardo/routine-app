import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import { ClientErrpr } from "src/error-handler";
import prisma from "@lib/prisma";
import env from "@lib/env";

interface UserSchema {
  username: string;
  email: string;
  password: string;
}

async function createUser (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post<{ Body: UserSchema }>(
    "/users",
    {
      schema: {
        body: z.object({
          username: z.string().min(3).max(24),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { username, email, password } = request.body;

      const existsUserByUsername = await prisma.user.findFirst({
        where: { username },
      });

      if (existsUserByUsername) {
        throw new ClientErrpr("Username already taken.");
      }

      const existsUserByEmail = await prisma.user.findFirst({
          where: { email },
        });

      if (existsUserByEmail) {
        throw new ClientErrpr("Email already in use.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

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
        user: user.id,
        token: token,
        message: `User created successfully`,
      });
    },
  );
}

export default createUser;
