const MINIMAX_API_URL = "https://api.minimax.chat/v1/text/chatcompletion_pro";

export interface MiniMaxMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function minimaxChat(
  messages: MiniMaxMessage[],
  model = "MiniMax-Text-01"
): Promise<string> {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY is not set");
  }

  const response = await fetch(MINIMAX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`MiniMax API error ${response.status}: ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}
