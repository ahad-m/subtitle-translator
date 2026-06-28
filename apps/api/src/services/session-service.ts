import { randomUUID } from "node:crypto";
import { createTranslationClientSecret } from "./openai-client";

export async function createSession(targetLanguage: string) {
  const sessionId = randomUUID();
  const secretResponse = await createTranslationClientSecret(targetLanguage);

  return {
    sessionId,
    clientSecret: secretResponse.value
  };
}
