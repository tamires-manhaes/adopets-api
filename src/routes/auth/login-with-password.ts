import { compare } from "bcryptjs";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { prisma } from "../../lib/prisma.ts";

import { BadRequestError } from "../_errors/bad-request-error.ts";

export const loginWithPasswordRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/auth/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Authenticate with password",
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),

        response: {
          201: z.object({
            token: z.string(),
            id: z.string(),
            roles: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (!userFromEmail) {
        throw new BadRequestError("Invalid credentials.");
      }

      const isPasswordValid = await compare(
        password,
        userFromEmail.passwordHash
      );

      if (!isPasswordValid) {
        throw new BadRequestError("Invalid credentials.");
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: "7d",
          },
        }
      );

      return reply.status(201).send({
        token,
        id: userFromEmail.id,
        roles: userFromEmail.role,
      });
    }
  );
};
