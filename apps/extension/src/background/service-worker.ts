chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("SERVICE WORKER MESSAGE", message);

  if (message.type === "START_TRANSLATION") {
    console.log("START_TRANSLATION received");
    sendResponse({ ok: true, step: "service-worker-received-start" });
    return true;
  }

  if (message.type === "STOP_TRANSLATION") {
    console.log("STOP_TRANSLATION received");
    sendResponse({ ok: true, step: "service-worker-received-stop" });
    return true;
  }
});

