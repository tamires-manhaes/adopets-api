import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { env } from "../../env.ts";

export const healthCheckRoute: FastifyPluginCallbackZod = (app) => {
  app.get("/health", () => {
    const healthCheck = {
      timestamp: new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      uptimeMinutes: `${Math.floor(process.uptime() / 60)} minutos`,
      environment: env.NODE_ENV,
      status: "OK",
    };
    return healthCheck;
  });
};
