import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function groqChat(prompt: string, options?: { maxTokens?: number; json?: boolean }) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: options?.maxTokens ?? 1024,
    temperature: 0.7,
    ...(options?.json ? { response_format: { type: "json_object" } } : {}),
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0]?.message?.content ?? "";
}
