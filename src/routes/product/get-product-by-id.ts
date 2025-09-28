import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma.ts";

export const getProductByIDRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/network/:id",
    {
      schema: {
        tags: ["Product"],
        summary: "Fetch product by ID",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const product = await prisma.product.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        return reply.status(404).send({ message: "Product not found" });
      }

      return reply.status(200).send(product);
    }
  );
};
