let activeTargetTabId: number | null = null;

export function setActiveTargetTabId(tabId: number) {
  activeTargetTabId = tabId;
}

export function clearActiveTargetTabId() {
  activeTargetTabId = null;
}

export function broadcastSubtitle(text: string) {
  if (!activeTargetTabId) {
    return;
  }

  chrome.tabs.sendMessage(activeTargetTabId, {
    type: "SUBTITLE_DELTA",
    text
  });
}
