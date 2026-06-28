export interface SubtitleDeltaEvent {
  type: "session.output_transcript.delta";
  delta: string;
}

export interface GlossaryTerm {
  source: string;
  target: string;
}
