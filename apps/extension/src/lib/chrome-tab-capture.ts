export async function ensureOffscreenDocument() {
  const exists = await chrome.offscreen.hasDocument?.();
  if (!exists) {
    await chrome.offscreen.createDocument({
      url: "public/offscreen.html",
      reasons: ["USER_MEDIA"],
      justification: "Capture tab audio for realtime subtitle translation"
    });
  }
}
