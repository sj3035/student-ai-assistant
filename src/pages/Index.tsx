import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { DashboardView } from "@/components/views/DashboardView";
import { TasksView } from "@/components/views/TasksView";
import { ProfileView } from "@/components/views/ProfileView";
import { SettingsView } from "@/components/views/SettingsView";
import { PromptTutorial } from "@/components/features/PromptTutorial";
import { ExplainSimply } from "@/components/features/ExplainSimply";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're asking about "${content}". Let me help you with that!\n\nAs your personalized AI assistant, I can help you with:\n• Planning and organizing your study schedule\n• Managing tasks and deadlines\n• Providing study tips and resources\n• Answering academic questions\n\nCould you provide more details about what you need?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "tasks":
        return <TasksView />;
      case "profile":
        return <ProfileView />;
      case "settings":
        return <SettingsView />;
      case "prompt-tutorial":
        return (
          <div className="p-6 max-w-2xl mx-auto">
            <PromptTutorial userDomain={profile?.primary_purpose || "general"} />
          </div>
        );
      case "explain-simply":
        return (
          <div className="p-6 max-w-2xl mx-auto">
            <ExplainSimply 
              userKnowledgeLevel={profile?.knowledge_level || "intermediate"}
              userDomain={profile?.primary_purpose || "general"}
            />
          </div>
        );
      case "chat":
      default:
        return (
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeItem={activeView}
          onItemClick={setActiveView}
        />
        <main className="flex-1 overflow-hidden">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Index;
