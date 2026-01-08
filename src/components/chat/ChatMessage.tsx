import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, User, ThumbsUp, ThumbsDown } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
          isUser ? "bg-primary" : "bg-muted"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Message bubble */}
      <div className="max-w-[75%] space-y-2">
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-chat-user text-chat-user-foreground rounded-tr-md"
              : "bg-chat-assistant text-chat-assistant-foreground rounded-tl-md"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          {timestamp && (
            <p
              className={cn(
                "text-xs mt-1.5",
                isUser ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {timestamp}
            </p>
          )}
        </div>

        {/* Feedback buttons for assistant messages */}
        {!isUser && (
          <div className="flex items-center gap-1 pl-1">
            <span className="text-xs text-muted-foreground mr-1">Was this helpful?</span>
            <button
              onClick={() => setFeedback(feedback === "up" ? null : "up")}
              className={cn(
                "p-1 rounded transition-colors",
                feedback === "up"
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-label="Helpful"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setFeedback(feedback === "down" ? null : "down")}
              className={cn(
                "p-1 rounded transition-colors",
                feedback === "down"
                  ? "text-destructive bg-destructive/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-label="Not helpful"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
