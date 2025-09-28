import { prisma } from "@/lib/prisma.ts";
import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";

export const createStoreRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/store/new/:networkId",
    {
      schema: {
        tags: ["Store"],
        summary: "Create a new store",
        params: z.object({
          networkId: z.string(),
        }),
        body: z.object({
          name: z.string(),
          address: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { networkId } = request.params;
      const { name, address } = request.body;

      const store = await prisma.store.create({
        data: {
          networkId,
          name,
          address,
        },
      });

      if (!store) {
        return reply.status(500).send("error creating store, try again");
      }

      return reply.status(200).send(store);
    }
  );
};
