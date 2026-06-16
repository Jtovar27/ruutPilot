import Groq from "groq-sdk";

let groqClient: Groq | null = null;

function getGroqClient() {
  if (groqClient) return groqClient;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  groqClient = new Groq({ apiKey });
  return groqClient;
}

export async function groqChat(prompt: string, options?: { maxTokens?: number; json?: boolean }) {
  const completion = await getGroqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: options?.maxTokens ?? 1024,
    temperature: 0.7,
    ...(options?.json ? { response_format: { type: "json_object" } } : {}),
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0]?.message?.content ?? "";
}
