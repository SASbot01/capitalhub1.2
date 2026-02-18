import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { sendChatMessage, type ChatMessage } from "../../api/chat";

interface ChatBubbleProps {
  context: "training" | "marketplace";
}

const CONTEXT_CONFIG = {
  training: {
    title: "Asesor de Formacion",
    greeting:
      "Hola! Soy tu asesor de formacion. Puedo ayudarte a elegir la ruta que mejor se adapte a tu perfil. Que te gustaria saber?",
    placeholder: "Pregunta sobre las rutas formativas...",
  },
  marketplace: {
    title: "Asistente Marketplace",
    greeting:
      "Hola! Soy tu asistente del marketplace. Puedo ayudarte a encontrar ofertas, mejorar tu perfil o preparar aplicaciones. En que puedo ayudarte?",
    placeholder: "Pregunta sobre el marketplace...",
  },
};

export default function ChatBubble({ context }: ChatBubbleProps) {
  const config = CONTEXT_CONFIG[context];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: config.greeting },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      // Send only user/assistant messages (skip the initial greeting for API)
      const apiMessages = updated.filter(
        (_, i) => i > 0 || updated[0].role === "user"
      );
      const res = await sendChatMessage(
        context,
        apiMessages.length > 0 ? apiMessages : [userMsg]
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.content },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Lo siento, no he podido procesar tu mensaje. Intentalo de nuevo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent shadow-glow transition-transform hover:scale-105 active:scale-95"
          aria-label={config.title}
        >
          <MessageCircle className="h-6 w-6 text-carbon" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-graphite bg-carbon shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-panel px-4 py-3 border-b border-graphite">
            <span className="text-sm font-semibold text-offwhite">
              {config.title}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-muted hover:text-offwhite transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-carbon"
                      : "bg-graphite text-offwhite"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-xl bg-graphite px-3 py-2 text-sm text-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Pensando...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-graphite bg-panel px-3 py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={config.placeholder}
              disabled={loading}
              className="flex-1 rounded-lg border border-graphite bg-carbon px-3 py-2 text-sm text-offwhite placeholder-muted outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-carbon transition-colors hover:bg-offwhite disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
