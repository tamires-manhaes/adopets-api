import { prisma } from "@/lib/prisma.ts";
import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";

export const getStoreByIDRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/store/:id",
    {
      schema: {
        tags: ["Store"],
        summary: "Get Store by ID",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const store = await prisma.store.findUnique({
        where: {
          id,
        },
      });

      if (!store) {
        return reply.status(404).send("store not found");
      }

      return reply.status(200).send(store);
    }
  );
};
