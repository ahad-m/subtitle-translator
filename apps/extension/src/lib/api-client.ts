export async function createBackendSession(input: { targetLanguage: string }) {
  const response = await fetch("http://localhost:3001/v1/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error(`Failed to create backend session: ${response.status}`);
  }

  return response.json();
}
