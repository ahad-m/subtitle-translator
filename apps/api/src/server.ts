import Fastify from "fastify";
import { healthRoutes } from "./routes/health";
import { sessionRoutes } from "./routes/sessions";
import { glossaryRoutes } from "./routes/glossary";

export function buildServer() {
  const app = Fastify({ logger: true });

  app.register(healthRoutes);
  app.register(sessionRoutes);
  app.register(glossaryRoutes);

  return app;
}
