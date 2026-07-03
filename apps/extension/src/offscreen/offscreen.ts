import { createBackendSession } from "../lib/api-client";
import { createRealtimeTranslationConnection } from "../lib/rtc-client";

let activeConnection: RTCPeerConnection | null = null;
let activeStream: MediaStream | null = null;
let isStarting = false;
let audioElement: HTMLAudioElement | null = null;

async function getTabAudioStream(streamId: string) {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSource: "tab",
        chromeMediaSourceId: streamId
      }
    } as MediaTrackConstraints,
    video: false
  });
}

async function startTranslation(streamId: string, apiBaseUrl: string) {
  if (activeConnection || isStarting) {
    return { ok: true, stage: "already-running" };
  }

  isStarting = true;

  try {
    const session = await createBackendSession(
      {
        targetLanguage: "ar"
      },
      apiBaseUrl
    );

    const sourceStream = await getTabAudioStream(streamId);

    // تشغيل صوت التبويب محليًا عبر عنصر Audio مخفي
    if (!audioElement) {
      audioElement = new Audio();
      audioElement.autoplay = true;
      audioElement.muted = false;
    }
    audioElement.srcObject = sourceStream;
    try {
      await audioElement.play();
      console.log("Tab audio playback started in offscreen");
    } catch (error) {
      console.error("Failed to start tab audio playback", error);
    }

    const { pc, stream } = await createRealtimeTranslationConnection(
      session.clientSecret,
      sourceStream,
      (delta) => {
        chrome.runtime.sendMessage({
          type: "SUBTITLE_DELTA",
          text: delta
        });
      }
    );

    activeConnection = pc;
    activeStream = stream;

    console.log("Translation session started", session.sessionId);

    return {
      ok: true,
      stage: "translation-started",
      sessionId: session.sessionId
    };
  } finally {
    isStarting = false;
  }
}

async function stopTranslation() {
  if (activeConnection) {
    activeConnection.close();
    activeConnection = null;
  }

  if (activeStream) {
    for (const track of activeStream.getTracks()) {
      track.stop();
    }
    activeStream = null;
  }

  if (audioElement) {
    try {
      audioElement.pause();
      audioElement.srcObject = null;
    } catch {
      // ignore
    }
    audioElement = null;
  }

  console.log("Translation session stopped");

  return {
    ok: true,
    stage: "translation-stopped"
  };
}

console.log("OFFSCREEN SCRIPT LOADED");

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("OFFSCREEN MESSAGE", message);

  if (message.type === "OFFSCREEN_PING") {
    console.log("OFFSCREEN PING RECEIVED");
    sendResponse({ ok: true, stage: "offscreen-received-ping" });
    return true;
  }

  if (message.type === "START_OFFSCREEN_TRANSLATION") {
    startTranslation(message.streamId, message.apiBaseUrl)
      .then((response) => sendResponse(response))
      .catch((error) => {
        console.error("OFFSCREEN START ERROR", error);
        sendResponse({ ok: false, error: String(error) });
      });

    return true;
  }

  if (message.type === "STOP_OFFSCREEN_TRANSLATION") {
    stopTranslation()
      .then((response) => sendResponse(response))
      .catch((error) => {
        console.error("OFFSCREEN STOP ERROR", error);
        sendResponse({ ok: false, error: String(error) });
      });

    return true;
  }
});

