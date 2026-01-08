import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { registerEnv } from "./config/env.js";
import databasePlugin from "./plugins/database.js";
import jwtPlugin from "./plugins/jwt.js";
import { authRoutes } from "./modules/auth/index.js";
import { foldersRoutes } from "./modules/folders/index.js";
import { documentsRoutes } from "./modules/documents/index.js";
import type { HealthResponse } from "@simpleconf/shared";
import { commentsRoutes } from "./modules/comments/index.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "debug",
      transport:
        process.env.NODE_ENV === "development"
          ? {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
    },
  });

  // Register environment config
  await registerEnv(app);

  // Register CORS
  await app.register(cors, {
    origin: app.config.CORS_ORIGIN,
    credentials: true,
  });

  // Register database connection
  await app.register(databasePlugin);

  // Register JWT plugin
  await app.register(jwtPlugin);

  // Register API routes
  await app.register(authRoutes, { prefix: "/api" });
  await app.register(foldersRoutes, { prefix: "/api" });
  await app.register(documentsRoutes, { prefix: "/api" });
  await app.register(commentsRoutes, { prefix: "/api" });

  // Health check endpoint
  app.get<{ Reply: HealthResponse }>("/health", async (_request, _reply) => {
    return { status: "ok" };
  });

  return app;
}
