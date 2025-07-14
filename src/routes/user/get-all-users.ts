import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma.ts";

export const getAllUsersRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/user/all",
    {
      schema: {
        tags: ["User"],
        summary: "Fetch all users",
      },
    },
    async (_request, reply) => {
      const users = await prisma.user.findMany();

      if (!users) {
        return reply.status(500).send({ message: "Error fetching users" });
      }

      return reply.status(200).send(users);
    }
  );
};
