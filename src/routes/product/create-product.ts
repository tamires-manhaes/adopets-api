import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";
import { BadRequestError } from "../_errors/bad-request-error.ts";

export const createProductkRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/store/:id/product",
    {
      schema: {
        tags: ["Product"],
        summary: "Create a product for Store",
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          name: z.string(),
          description: z.string(),
          category: z.string(),
          price: z.number(),
          stock: z.number(),
          expirationDate: z.date(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name, description, category, price, stock, expirationDate } =
        request.body;

      const store = await prisma.store.findFirst({
        where: {
          id,
        },
      });

      if (!store) {
        throw new BadRequestError("store does not exists");
      }

      const product = await prisma.product.create({
        data: {
          storeId: id,
          name,
          description,
          category,
          price,
          stock,
          expirationDate,
        },
      });

      if (!product) {
        return reply.status(500).send({ error: "Failed to create product" });
      }

      return reply.status(201).send({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
        },
      });
    }
  );
};
