export interface CreateSessionRequest {
  targetLanguage: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  clientSecret: string;
}
