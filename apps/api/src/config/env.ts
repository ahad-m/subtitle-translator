import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT ?? 3001),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  OPENAI_SAFETY_IDENTIFIER: process.env.OPENAI_SAFETY_IDENTIFIER ?? "subtitle-translator"
};
