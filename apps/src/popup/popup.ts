document.getElementById("start")?.addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "START_TRANSLATION" });
});

document.getElementById("stop")?.addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "STOP_TRANSLATION" });
});
