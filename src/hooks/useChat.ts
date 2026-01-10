import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export function useChat() {
  const { profile, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const userIdRef = useRef<string | undefined>(user?.id);

  // Keep ref in sync
  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  // Load chat history on mount
  useEffect(() => {
    if (!user) {
      setIsLoadingHistory(false);
      return;
    }

    const loadHistory = async () => {
      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        if (data) {
          const loadedMessages: Message[] = data.map((msg) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            content: msg.content,
            timestamp: new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setMessages(loadedMessages);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [user]);

  const saveMessage = useCallback(async (role: "user" | "assistant", content: string): Promise<{ id: string } | null> => {
    const userId = userIdRef.current;
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          user_id: userId,
          role,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving message:", error);
      return null;
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Save user message to database
    const savedUserMsg = await saveMessage("user", content);
    if (savedUserMsg) {
      userMessage.id = savedUserMsg.id;
    }

    let assistantContent = "";
    const assistantMessageId = crypto.randomUUID();

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 
              ? { ...m, content: assistantContent } 
              : m
          );
        }
        return [...prev, {
          id: assistantMessageId,
          role: "assistant" as const,
          content: assistantContent,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }];
      });
    };

    try {
      const currentMessages = await new Promise<Message[]>(resolve => {
        setMessages(prev => {
          resolve(prev);
          return prev;
        });
      });

      const chatMessages = currentMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: chatMessages,
          profile: profile ? {
            primary_purpose: profile.primary_purpose,
            knowledge_level: profile.knowledge_level,
            explanation_style: profile.explanation_style,
            response_length: profile.response_length,
            learning_preference: profile.learning_preference,
          } : null,
        }),
      });

      if (!response.ok || !response.body) {
        if (response.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description: "Please wait a moment before sending another message.",
            variant: "destructive",
          });
          throw new Error("Rate limit exceeded");
        }
        if (response.status === 402) {
          toast({
            title: "Credits exhausted",
            description: "Please add credits to continue using the AI assistant.",
            variant: "destructive",
          });
          throw new Error("Credits exhausted");
        }
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const chunkContent = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (chunkContent) updateAssistant(chunkContent);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const chunkContent = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (chunkContent) updateAssistant(chunkContent);
          } catch { /* ignore */ }
        }
      }

      // Save assistant message to database after streaming completes
      if (assistantContent) {
        const savedAssistantMsg = await saveMessage("assistant", assistantContent);
        if (savedAssistantMsg) {
          setMessages(prev => prev.map(m => 
            m.id === assistantMessageId ? { ...m, id: savedAssistantMsg.id } : m
          ));
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      if (!assistantContent) {
        toast({
          title: "Error",
          description: "Failed to get a response. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [profile, saveMessage]);

  const clearChat = useCallback(async () => {
    const userId = userIdRef.current;
    if (!userId) {
      setMessages([]);
      return;
    }

    try {
      const { error } = await supabase
        .from("chat_messages")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
      toast({
        title: "Error",
        description: "Failed to clear chat history.",
        variant: "destructive",
      });
    }
  }, []);

  return { messages, isLoading, isLoadingHistory, sendMessage, clearChat };
}
