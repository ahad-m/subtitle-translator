import { env } from "../config/env";

export async function createTranslationClientSecret(targetLanguage: string) {
  const response = await fetch(
    "https://api.openai.com/v1/realtime/translations/client_secrets",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Safety-Identifier": env.OPENAI_SAFETY_IDENTIFIER
      },
      body: JSON.stringify({
        session: {
            model: "gpt-realtime-translate",
            audio: {
            output: {
                language: targetLanguage
            }
            }
        }
        })


    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}
