import {
  broadcastSubtitle,
  clearActiveTargetTabId,
  setActiveTargetTabId
} from "./message-router";

let isTranslationRunning = false;

async function ensureOffscreenDocument() {
  const hasDocument = await chrome.offscreen.hasDocument?.();

  if (!hasDocument) {
    await chrome.offscreen.createDocument({
      url: "public/offscreen.html",
      reasons: ["USER_MEDIA"],
      justification: "Need offscreen document for media APIs"
    });
  }
}

async function getActiveTabId() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  const tab = tabs[0];

  if (!tab?.id) {
    throw new Error("No active tab found");
  }

  return tab.id;
}

async function getTabStreamId(tabId: number) {
  return chrome.tabCapture.getMediaStreamId({
    targetTabId: tabId
  });
}

async function getApiBaseUrl() {
  const result = await chrome.storage.local.get(["apiBaseUrl"]);
  const value = result.apiBaseUrl?.trim();

  if (!value) {
    throw new Error("API base URL is not configured");
  }

  return value.replace(/\/$/, "");
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("SERVICE WORKER MESSAGE", message);

  if (message.type === "START_TRANSLATION") {
    // إذا كانت جلسة الترجمة شغالة بالفعل، لا تحاول فتح جلسة جديدة
    if (isTranslationRunning) {
      sendResponse({ ok: true, stage: "already-running" });
      return true;
    }

    Promise.resolve()
      .then(async () => {
        const tabId = await getActiveTabId();
        setActiveTargetTabId(tabId);

        const streamId = await getTabStreamId(tabId);
        const apiBaseUrl = await getApiBaseUrl();
        console.log("TAB STREAM ID", streamId);
        console.log("API BASE URL", apiBaseUrl);

        await ensureOffscreenDocument();
        console.log("OFFSCREEN DOCUMENT CREATED OR REUSED");

        const pingResponse = await chrome.runtime.sendMessage({
          type: "OFFSCREEN_PING"
        });

        console.log("OFFSCREEN RESPONSE", pingResponse);

        const startResponse = await chrome.runtime.sendMessage({
          type: "START_OFFSCREEN_TRANSLATION",
          streamId,
          apiBaseUrl
        });

        console.log("OFFSCREEN START RESPONSE", startResponse);

        if (startResponse?.ok) {
          isTranslationRunning = true;
        }

        sendResponse(startResponse);
      })
      .catch((error) => {
        console.error("START TRANSLATION ERROR", error);
        sendResponse({ ok: false, error: String(error) });
      });

    return true;
  }

  if (message.type === "STOP_TRANSLATION") {
    Promise.resolve()
      .then(async () => {
        const stopResponse = await chrome.runtime.sendMessage({
          type: "STOP_OFFSCREEN_TRANSLATION"
        });

        clearActiveTargetTabId();
        isTranslationRunning = false;

        sendResponse(stopResponse);
      })
      .catch((error) => {
        console.error("STOP TRANSLATION ERROR", error);
        sendResponse({ ok: false, error: String(error) });
      });

    return true;
  }

  if (message.type === "SUBTITLE_DELTA") {
    broadcastSubtitle(message.text);
    sendResponse({ ok: true });
    return true;
  }
});
