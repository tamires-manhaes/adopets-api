import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.ts";

export const getUserByIDRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/user/:id",
    {
      schema: {
        tags: ["User"],
        summary: "Fetch user by ID",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      return reply.status(200).send(user);
    }
  );
};
