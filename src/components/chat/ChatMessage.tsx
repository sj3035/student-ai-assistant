import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, User, ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "h-9 w-9 rounded-full flex items-center justify-center shrink-0 shadow-sm",
          isUser 
            ? "bg-gradient-to-br from-primary to-primary/80" 
            : "bg-gradient-to-br from-muted to-background border border-border"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary" />
        )}
      </div>

      {/* Message bubble */}
      <div className="max-w-[75%] space-y-2">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm",
            isUser
              ? "bg-gradient-to-br from-chat-user to-chat-user/90 text-chat-user-foreground rounded-tr-md"
              : "bg-chat-assistant text-chat-assistant-foreground rounded-tl-md border border-border/50"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          {timestamp && (
            <p
              className={cn(
                "text-[10px] mt-2 font-medium",
                isUser ? "text-primary-foreground/60" : "text-muted-foreground"
              )}
            >
              {timestamp}
            </p>
          )}
        </div>

        {/* Actions for assistant messages */}
        {!isUser && (
          <div className="flex items-center gap-2 pl-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-muted-foreground">Was this helpful?</span>
            <button
              onClick={() => setFeedback(feedback === "up" ? null : "up")}
              className={cn(
                "p-1.5 rounded-lg transition-all duration-200",
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
                "p-1.5 rounded-lg transition-all duration-200",
                feedback === "down"
                  ? "text-destructive bg-destructive/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-label="Not helpful"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
              aria-label="Copy response"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
