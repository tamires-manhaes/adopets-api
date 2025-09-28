import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";
import { BadRequestError } from "../_errors/bad-request-error.ts";

export const createSaleRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/store/:id/sale",
    {
      schema: {
        tags: ["Sale"],
        summary: "Create a sale for Store",
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          clientId: z.string(),
          products: z.array(
            z.object({
              productId: z.string(),
              quantity: z.number(),
            })
          ),
          saleDate: z.date(),
          totalPrice: z.number(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { clientId, products, saleDate } = request.body;

      const store = await prisma.store.findFirst({
        where: {
          id,
        },
      });

      if (!store) {
        throw new BadRequestError("store does not exists");
      }

      let totalPrice = 0;

      products.forEach(async (product) => {
        let p = await prisma.product.findUnique({
          where: {
            id: product.productId,
          },
        });

        if (p) {
          totalPrice += p.price * product.quantity;
        }
      });

      const sale = await prisma.sale.create({
        data: {
          storeId: id,
          clientId,
          saleDate,
          products: {
            create: products.map((product) => ({
              productId: product.productId,
              quantity: product.quantity,
            })),
          },
          totalPrice,
        },
      });

      if (!sale) {
        return reply.status(500).send({ error: "Failed to create sale" });
      }

      return reply.status(201).send({
        product: {
          id: sale.id,
          client: sale.clientId,
          products,
        },
      });
    }
  );
};
