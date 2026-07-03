const apiUrlInput = document.getElementById("apiUrl") as HTMLInputElement | null;
const saveButton = document.getElementById("save");

async function loadSettings() {
  const result = await chrome.storage.local.get(["apiBaseUrl"]);
  if (apiUrlInput) {
    apiUrlInput.value = result.apiBaseUrl ?? "";
  }
}

saveButton?.addEventListener("click", async () => {
  const value = apiUrlInput?.value.trim() ?? "";
  await chrome.storage.local.set({ apiBaseUrl: value });
  console.log("API URL SAVED", value);
});

document.getElementById("start")?.addEventListener("click", async () => {
  const response = await chrome.runtime.sendMessage({ type: "START_TRANSLATION" });
  console.log("POPUP START RESPONSE", response);
});

document.getElementById("stop")?.addEventListener("click", async () => {
  const response = await chrome.runtime.sendMessage({ type: "STOP_TRANSLATION" });
  console.log("POPUP STOP RESPONSE", response);
});

loadSettings();
