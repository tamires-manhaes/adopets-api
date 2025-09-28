import { prisma } from "@/lib/prisma.ts";
import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";

export const getSaleByIDRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/sale/:id",
    {
      schema: {
        tags: ["Sale"],
        summary: "Get a sale by ID",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const sale = await prisma.sale.findUnique({
        where: {
          id,
        },
      });

      if (!sale) {
        return reply.status(404).send("sale not found");
      }

      return reply.status(200).send(sale);
    }
  );
};
