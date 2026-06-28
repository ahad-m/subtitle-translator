export function broadcastSubtitle(text: string) {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (!tab.id) continue;
      chrome.tabs.sendMessage(tab.id, {
        type: "SUBTITLE_DELTA",
        text
      });
    }
  });
}
