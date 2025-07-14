import type { FastifyInstance } from "fastify";
import { BadRequestError } from "./routes/_errors/bad-request-error.ts";
import { UnauthorizedError } from "./routes/_errors/unauthorized-error.ts";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, _request, reply) => {
  if (error instanceof BadRequestError) {
    reply.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedError) {
    reply.status(401).send({
      message: error.message,
    });
  }

  // biome-ignore lint/suspicious/noConsole: Only for debugging purposes
  console.error(error);

  // send error to some observability platform
  reply.status(500).send({ message: "Internal server error" });
};
