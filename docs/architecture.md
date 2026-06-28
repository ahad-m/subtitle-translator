# Architecture

## Flow
1. User opens course page
2. User clicks Start in extension popup
3. Extension requests backend session
4. Backend creates short-lived OpenAI translation client secret
5. Extension opens realtime translation connection
6. Transcript deltas stream back
7. Subtitle overlay renders Arabic output

## Notes
- Browser media should use WebRTC.
- Backend must never expose the standard API key to the extension.
- Glossary will later become site-aware and course-aware.
