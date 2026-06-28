import type { FastifyInstance } from "fastify";
import { getGlossaryForSite } from "../services/glossary-service";

export async function glossaryRoutes(app: FastifyInstance) {
  app.get("/v1/glossary", async (request) => {
    const query = request.query as { site?: string };
    return getGlossaryForSite(query.site);
  });
}
