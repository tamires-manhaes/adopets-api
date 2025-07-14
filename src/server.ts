import { fastifyCors } from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { fastifyMultipart } from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { env } from "./env.ts";

import { errorHandler } from "./error-handler.ts";
import { loginWithPasswordRoute } from "./routes/auth/login-with-password.ts";
import { requestPasswordRecoverRoute } from "./routes/auth/request-password-recover.ts";
import { resetPasswordRoute } from "./routes/auth/reset-password.ts";
import { healthCheckRoute } from "./routes/health/status.ts";
import { createUserRoute } from "./routes/user/create-user.ts";
import { getAllUsersRoute } from "./routes/user/get-all-users.ts";
import { getUserByIDRoute } from "./routes/user/get-by-id.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "adopets API",
      description: "adopets API documentation",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifyMultipart);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// ROUTES

app.register(healthCheckRoute);

// -------- AUTH ---------
app.register(loginWithPasswordRoute);
app.register(resetPasswordRoute);
app.register(requestPasswordRecoverRoute);

// -------- USER --------
app.register(getAllUsersRoute);
app.register(createUserRoute);
app.register(getUserByIDRoute);

// -------- STORE --------

// -------- CLIENT --------

// -------- NETWORK --------

app.listen({ port: env.PORT }).then(() => {
  // biome-ignore lint/suspicious/noConsole: only for development
  console.log(`HTTP Server running at http://localhost:${env.PORT}`);
});
