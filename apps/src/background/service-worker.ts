import { startSession, stopSession } from "./session-controller";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "START_TRANSLATION") {
    startSession()
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  }

  if (message.type === "STOP_TRANSLATION") {
    stopSession()
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  }
});
