export async function createRealtimeTranslationConnection(
  clientSecret: string,
  sourceStream: MediaStream,
  onTranscriptDelta: (text: string) => void
) {
  const pc = new RTCPeerConnection();
  pc.addTrack(sourceStream.getAudioTracks()[0], sourceStream);

  const events = pc.createDataChannel("oai-events");
  events.onmessage = ({ data }) => {
    const event = JSON.parse(data);

    if (event.type === "session.output_transcript.delta") {
      onTranscriptDelta(event.delta);
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const response = await fetch(
    "https://api.openai.com/v1/realtime/translations/calls",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clientSecret}`,
        "Content-Type": "application/sdp"
      },
      body: offer.sdp ?? ""
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const answer = await response.text();

  await pc.setRemoteDescription({
    type: "answer",
    sdp: answer
  });

  return {
    pc,
    stream: sourceStream
  };
}
