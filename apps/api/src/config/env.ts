import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env")
});

console.log("ENV CHECK", {
  PORT: process.env.PORT,
  OPENAI_API_KEY_EXISTS: Boolean(process.env.OPENAI_API_KEY),
  OPENAI_API_KEY_PREFIX: process.env.OPENAI_API_KEY?.slice(0, 7) ?? null,
  OPENAI_SAFETY_IDENTIFIER: process.env.OPENAI_SAFETY_IDENTIFIER
});

export const env = {
  PORT: Number(process.env.PORT ?? 3001),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  OPENAI_SAFETY_IDENTIFIER: process.env.OPENAI_SAFETY_IDENTIFIER ?? "subtitle-translator"
};

