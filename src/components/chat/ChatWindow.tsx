import { useRef, useEffect, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ContextPanel } from "./ContextPanel";
import { Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export function ChatWindow({ messages, onSendMessage, isLoading }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionTopic, setSessionTopic] = useState("General Assistance");
  const [detectedMood, setDetectedMood] = useState("neutral");
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate context detection based on messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
      if (lastUserMessage) {
        // Detect topic
        if (lastUserMessage.content.toLowerCase().includes("study") || 
            lastUserMessage.content.toLowerCase().includes("schedule")) {
          setSessionTopic("Study Planning");
        } else if (lastUserMessage.content.toLowerCase().includes("task") || 
                   lastUserMessage.content.toLowerCase().includes("due")) {
          setSessionTopic("Task Management");
        } else if (lastUserMessage.content.toLowerCase().includes("focus") || 
                   lastUserMessage.content.toLowerCase().includes("concentrate")) {
          setSessionTopic("Productivity Tips");
        } else if (lastUserMessage.content.toLowerCase().includes("notes") || 
                   lastUserMessage.content.toLowerCase().includes("summary")) {
          setSessionTopic("Note Summarization");
        }

        // Detect mood (simplified simulation)
        if (lastUserMessage.content.toLowerCase().includes("help") || 
            lastUserMessage.content.toLowerCase().includes("struggling")) {
          setDetectedMood("stressed");
        } else if (lastUserMessage.content.toLowerCase().includes("how") || 
                   lastUserMessage.content.toLowerCase().includes("what")) {
          setDetectedMood("curious");
        } else if (lastUserMessage.content.toLowerCase().includes("plan") || 
                   lastUserMessage.content.toLowerCase().includes("organize")) {
          setDetectedMood("motivated");
        } else {
          setDetectedMood("focused");
        }

        // Update recent activity
        setRecentActivity(prev => {
          const newActivity = `Asked about ${sessionTopic.toLowerCase()}`;
          const updated = [newActivity, ...prev.filter(a => a !== newActivity)].slice(0, 4);
          return updated;
        });
      }
    }
  }, [messages, sessionTopic]);

  return (
    <div className="flex h-full bg-background">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                How can I help you today?
              </h2>
              <p className="text-muted-foreground max-w-md">
                I'm your personal AI assistant for productivity. Ask me about your tasks, 
                schedule, study tips, or anything else you need help with.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-lg">
                {[
                  "Help me plan my study schedule",
                  "What tasks do I have due this week?",
                  "Give me tips for better focus",
                  "Summarize my recent notes",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSendMessage(suggestion)}
                    className="text-sm text-left px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="bg-chat-assistant rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Thinking</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        <ChatInput onSend={onSendMessage} disabled={isLoading} />
      </div>

      {/* Context Panel */}
      <ContextPanel
        sessionTopic={sessionTopic}
        detectedMood={detectedMood}
        recentActivity={recentActivity}
        messageCount={messages.length}
      />
    </div>
  );
}
