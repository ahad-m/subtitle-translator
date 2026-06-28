import { SubtitleRenderer } from "./subtitle-renderer";

const renderer = new SubtitleRenderer();

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SUBTITLE_DELTA") {
    renderer.append(message.text);
  }
});
