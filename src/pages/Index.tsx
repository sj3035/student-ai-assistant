import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { DashboardView } from "@/components/views/DashboardView";
import { TasksView } from "@/components/views/TasksView";
import { ProfileView } from "@/components/views/ProfileView";
import { SettingsView } from "@/components/views/SettingsView";
import { PromptTutorial } from "@/components/features/PromptTutorial";
import { ExplainSimply } from "@/components/features/ExplainSimply";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("chat");
  const { profile } = useAuth();
  const { messages, isLoading, sendMessage } = useChat();

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
          <div className="p-6 max-w-2xl mx-auto overflow-auto h-full">
            <PromptTutorial 
              userDomain={profile?.primary_purpose || "general"} 
              userKnowledgeLevel={profile?.knowledge_level || "intermediate"}
            />
          </div>
        );
      case "explain-simply":
        return (
          <div className="p-6 max-w-2xl mx-auto overflow-auto h-full">
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
            onSendMessage={sendMessage}
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
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">{renderContent()}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Index;
