import { prisma } from "@/lib/prisma.ts";
import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";

export const getAllStoreByNetworkIDRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/store/network/:id",
    {
      schema: {
        tags: ["Store"],
        summary: "Find the stores by Network ID",
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
        include: {
          stores: true,
        },
      });

      if (!network) {
        return reply.status(404).send("network not found");
      }

      return reply.status(200).send(network.stores);
    }
  );
};
