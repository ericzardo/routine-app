import { FastifyRequest } from "fastify"
import jwt from "jsonwebtoken"
import prisma from "@lib/prisma"
import env from "@lib/env"
import { ForbiddenError, NotFoundError, ClientErrpr } from "src/error-handler";
import buildDocumentHierarchy from "@utils/buildDocumentHierarchy";

interface JwtPayload {
  id: string,
}

async function auth (request: FastifyRequest) {
  try {

    const token = request.cookies["token"];
    console.log(token)
    if (!token) {
      throw new ForbiddenError("Not authenticated.")
    }

    try {
      const { id } = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      console.log('User ID:', id);
    } catch (error) {
      console.log('JWT Verify Error:', error)
      throw new ClientErrpr("Invalid or missing auth token");
    }
    
    const { id } = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    console.log(id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        profiles: {
          include: {
            alarms: true,
            documents: {
              include: {
                content: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }
    
    user.profiles.forEach((profile) => {
      profile.documents = buildDocumentHierarchy(
        profile.documents.map((doc) => ({
          ...doc,
          content: [],
        }))
      );
    });

    request.user = user;
  } catch (error) {
    console.log(error);
    throw new ClientErrpr("Invalid or missing auth token")
  }
}

export default auth;