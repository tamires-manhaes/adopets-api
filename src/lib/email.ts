import nodemailer from "nodemailer";
import { env } from "../env.ts";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Adopets" <no-reply@adopets.com>',
    to,
    subject,
    html,
  });
};
