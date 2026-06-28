import { createBackendSession } from "../lib/api-client";
import { createRealtimeTranslationConnection } from "../lib/rtc-client";

let activeConnection: RTCPeerConnection | null = null;

export async function startSession() {
  const session = await createBackendSession({
    targetLanguage: "ar"
  });

  activeConnection = await createRealtimeTranslationConnection(session.clientSecret);
  console.log("Translation session started", session.sessionId);
}

export async function stopSession() {
  if (activeConnection) {
    activeConnection.close();
    activeConnection = null;
  }
  console.log("Translation session stopped");
}
