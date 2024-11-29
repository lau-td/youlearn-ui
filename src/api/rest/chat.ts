import { ChatMessage } from "../interfaces";
import { API_URL } from "./constant";

export const streamChat = async (
  documentId: string,
  query: string,
  onMessage: (content: string) => void
) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      documentId,
      query,
    }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error("Failed to create stream reader");
  }

  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const data = JSON.parse(line.slice(5));
      if (data.event === "message" && data.answer) {
        onMessage(data.answer);
      }
    }
  }
};

export const getChatMessages = async (
  documentId: string
): Promise<{
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
  data: ChatMessage[];
}> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/chat/messages?documentId=${documentId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chat messages");
  }

  return response.json();
};
