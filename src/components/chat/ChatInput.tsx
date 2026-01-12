import { useState, KeyboardEvent } from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const quickActions = [
  { label: "Explain a concept", prompt: "Can you explain a concept to me? I'd like to understand it clearly based on my knowledge level." },
  { label: "Plan my study", prompt: "Help me create a personalized study plan. Consider my goals and learning style." },
  { label: "Summarize content", prompt: "Please summarize the following content into clear, digestible key points:" },
  { label: "Generate examples", prompt: "Generate practical examples to help me understand this better. Use examples appropriate for my level." },
];

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    setIsListening(!isListening);
    // Voice input would be handled here with ElevenLabs or Web Speech API
  };

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-sm p-4">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onSend(action.prompt)}
              disabled={disabled}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-muted hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all duration-200 disabled:opacity-50 font-medium"
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your studies, tasks, or schedule..."
              className="min-h-[52px] max-h-[200px] resize-none pr-12 rounded-xl border-border bg-background focus-visible:ring-primary shadow-soft"
              rows={1}
              disabled={disabled}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleMicClick}
                  className={`absolute right-3 bottom-3 p-1.5 rounded-lg transition-all duration-200 ${
                    isListening 
                      ? "bg-primary text-primary-foreground animate-pulse" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Mic className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isListening ? "Stop listening" : "Voice input"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            size="icon"
            className="h-[52px] w-[52px] rounded-xl shrink-0 shadow-soft"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        <p className="text-[11px] text-muted-foreground text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
