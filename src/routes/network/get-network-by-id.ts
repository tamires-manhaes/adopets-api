import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.ts";

export const getNetworkByIDRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/network/:id",
    {
      schema: {
        tags: ["Network"],
        summary: "Fetch networks by ID",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const network = await prisma.network.findUnique({
        where: {
          id,
        },
      });

      if (!network) {
        return reply.status(404).send({ message: "User not found" });
      }

      return reply.status(200).send(network);
    }
  );
};
