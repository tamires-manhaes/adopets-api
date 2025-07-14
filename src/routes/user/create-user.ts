import { UserRole } from "@prisma/client";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";
import { generatePasswordHash } from "../../utils/generator.ts";
import { BadRequestError } from "../_errors/bad-request-error.ts";

export const createUserRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/user/new",
    {
      schema: {
        tags: ["User"],
        summary: "Create a new user",
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          cpf: z.string(),
          phone: z.string(),
          password: z.string().min(
            6,

            { message: "Password must be at least 6 characters long" }
          ),
          role: z.enum(UserRole),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, cpf, phone, password, role } = request.body;

      const userWithSameEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (userWithSameEmail) {
        throw new BadRequestError("User with same e-mail already exists.");
      }

      const passwordHash = await generatePasswordHash(password);

      const result = await prisma.user.create({
        data: {
          name,
          email,
          cpf,
          phone,
          passwordHash,
          role,
        },
      });

      if (!result) {
        return reply.status(500).send({ error: "Failed to create user" });
      }

      return reply.status(201).send({
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
        },
      });
    }
  );
};
