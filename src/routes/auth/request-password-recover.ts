import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { sendEmail } from "../../lib/email.ts";
import { prisma } from "../../lib/prisma.ts";

export const requestPasswordRecoverRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/auth/request-password-recover",
    {
      schema: {
        tags: ["Auth"],
        summary: "Request password recovery",
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      // Logic to handle password recovery request
      // This could involve sending an email with a recovery link

      const userFromEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (!userFromEmail) {
        // We don't want to people to know if the user really exists
        return reply.status(201).send();
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: "1h",
          },
        }
      );

      await prisma.passwordResetToken.create({
        data: {
          userId: userFromEmail.id,
          token,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
        },
      });

      const resetLink = `/reset-password?token=${token}`;

      const emailHtml = `
        <h1>Redefinição de Senha - Adopets</h1>
        <p>Olá, ${userFromEmail.name},</p>
        <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este link expira em 1 hora. Se você não solicitou esta ação, ignore este e-mail.</p>
        <p>Atenciosamente,<br>Equipe Adopets</p>
      `;

      try {
        await sendEmail(
          userFromEmail.email,
          "Redefinição de Senha - Adopets",
          emailHtml
        );
        return reply.status(200).send({
          message: "If the email exists, a reset link has been sent.",
        });
      } catch (_error) {
        return reply.status(500).send({ error: "Failed to send reset email" });
      }
    }
  );
};
