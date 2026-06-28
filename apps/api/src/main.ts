import { buildServer } from "./server";
import { env } from "./config/env";

const app = buildServer();

app.listen({ port: env.PORT, host: "0.0.0.0" }).then(() => {
  console.log(`API listening on :${env.PORT}`);
});
