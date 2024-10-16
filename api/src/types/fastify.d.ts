import "fastify";

interface Profile {
  id: string;
  name: string;
  userId: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      username: string;
      email: string;
      profiles: Profile[];
    };
  }
}