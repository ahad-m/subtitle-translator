export function getGlossaryForSite(_site?: string) {
  return {
    profileId: "default-automotive",
    terms: [
      { source: "fuel table", target: "جدول الوقود" },
      { source: "ignition timing", target: "توقيت الإشعال" },
      { source: "boost", target: "البوست" }
    ]
  };
}
