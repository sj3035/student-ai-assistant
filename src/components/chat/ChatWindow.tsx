import { useRef, useEffect, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ContextPanel } from "./ContextPanel";
import { Sparkles, Wand2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface UserPreferences {
  knowledgeLevel?: string;
  explanationStyle?: string;
  responseLength?: string;
  primaryPurpose?: string;
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  userPreferences?: UserPreferences;
}

export function ChatWindow({ messages, onSendMessage, isLoading, userPreferences }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionTopic, setSessionTopic] = useState("General Assistance");
  const [detectedMood, setDetectedMood] = useState("neutral");
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [showAdaptingIndicator, setShowAdaptingIndicator] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Show adapting indicator briefly when loading
  useEffect(() => {
    if (isLoading && userPreferences?.knowledgeLevel) {
      setShowAdaptingIndicator(true);
    } else if (!isLoading) {
      const timer = setTimeout(() => setShowAdaptingIndicator(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, userPreferences]);

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
        } else if (lastUserMessage.content.toLowerCase().includes("explain") || 
                   lastUserMessage.content.toLowerCase().includes("concept")) {
          setSessionTopic("Concept Explanation");
        } else if (lastUserMessage.content.toLowerCase().includes("code") || 
                   lastUserMessage.content.toLowerCase().includes("program")) {
          setSessionTopic("Programming Help");
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

  const getAdaptingMessage = () => {
    if (!userPreferences?.knowledgeLevel) return "Preparing response...";
    
    const messages = [
      `Adapting to ${userPreferences.knowledgeLevel} level`,
      "Using your preferred style",
      "Based on your preferences"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="flex h-full bg-background">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Welcome banner */}
        <div className="px-4 md:px-6 pt-4 md:pt-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-xl px-4 py-3">
            <p className="text-sm text-center text-foreground">
              <span className="font-semibold">Welcome to MindForge!</span> Ask anything or use a quick action below.
            </p>
          </div>
        </div>

        {/* Chat messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                How can I help you today?
              </h2>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                I'm your personalized AI learning assistant. Ask me about your studies, 
                tasks, or anything you need help understanding.
              </p>
              
              {/* Personalization indicator */}
              {userPreferences?.knowledgeLevel && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-full">
                  <Wand2 className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    Responses tailored to your <span className="text-primary font-medium">{userPreferences.knowledgeLevel}</span> level
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-lg">
                {[
                  "Help me plan my study schedule",
                  "Explain a complex concept simply",
                  "Give me tips for better focus",
                  "Summarize a topic for me",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSendMessage(suggestion)}
                    className="text-sm text-left px-4 py-3.5 rounded-xl border border-border bg-background hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 text-foreground group"
                  >
                    <span className="group-hover:text-primary transition-colors">{suggestion}</span>
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
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-chat-assistant rounded-2xl rounded-tl-md px-4 py-3 border border-border/50">
                    <div className="flex items-center gap-3">
                      {showAdaptingIndicator && (
                        <span className="text-xs text-primary font-medium animate-pulse">
                          {getAdaptingMessage()}
                        </span>
                      )}
                      {!showAdaptingIndicator && (
                        <span className="text-sm text-muted-foreground">Thinking</span>
                      )}
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
        userPreferences={userPreferences}
      />
    </div>
  );
}
