import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { prisma } from "../../lib/prisma.ts";
import { generatePasswordHash } from "../../utils/generator.ts";

export const resetPasswordRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/auth/reset-password",
    {
      schema: {
        tags: ["Auth"],
        summary: "Reset password",
        body: z.object({
          token: z.string(),
          newPassword: z
            .string()
            .min(6, { message: "Password must be at least 6 characters long" }),
        }),
      },
    },
    async (request, reply) => {
      const { newPassword, token } = request.body;

      let decoded = { sub: "" };
      try {
        decoded = await request.jwtVerify<{ sub: string }>();
      } catch (_error) {
        return reply.status(400).send({ error: "Invalid or expired token" });
      }

      const resetToken = await prisma.passwordResetToken.findFirst({
        where: {
          token,
          userId: decoded.sub,
          expiresAt: { gte: new Date() },
        },
      });

      if (!resetToken) {
        return reply.status(400).send({ error: "Invalid or expired token" });
      }

      const passwordHash = await generatePasswordHash(newPassword);

      await prisma.user.update({
        where: { id: decoded.sub },
        data: { passwordHash },
      });

      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });

      return reply.status(200).send({ message: "Password reset successfully" });
    }
  );
};
