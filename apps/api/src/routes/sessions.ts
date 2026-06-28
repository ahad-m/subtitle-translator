import type { FastifyInstance } from "fastify";
import { createSession } from "../services/session-service";

export async function sessionRoutes(app: FastifyInstance) {
  app.post("/v1/sessions", async (request) => {
    const body = request.body as { targetLanguage?: string };
    return createSession(body.targetLanguage ?? "ar");
  });
}
