import { apiClient } from "./client";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  context: "training" | "marketplace";
  messages: ChatMessage[];
}

interface ChatResponseBody {
  content: string;
  context: string;
  tokensUsed: number;
}

export function sendChatMessage(
  context: "training" | "marketplace",
  messages: ChatMessage[]
): Promise<ChatResponseBody> {
  return apiClient.post<ChatResponseBody>(
    "/api/chat",
    { context, messages } as ChatRequestBody,
    true
  );
}
