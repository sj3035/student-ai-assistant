import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { DashboardView } from "@/components/views/DashboardView";
import { TasksView } from "@/components/views/TasksView";
import { ProfileView } from "@/components/views/ProfileView";
import { SettingsView } from "@/components/views/SettingsView";

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

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "Help me plan my study schedule": `I'd be happy to help you create an effective study schedule! Here's a personalized plan based on your current courses:\n\n📚 **Monday - Wednesday**\n• 9:00 AM - 11:00 AM: Math & Physics focus\n• 2:00 PM - 4:00 PM: Reading & Essay work\n\n📚 **Thursday - Friday**\n• 10:00 AM - 12:00 PM: Lab preparation\n• 3:00 PM - 5:00 PM: Review sessions\n\n💡 **Pro tip:** Use the Pomodoro technique (25 min work, 5 min break) for better focus!\n\nWould you like me to add these to your calendar?`,
        "What tasks do I have due this week?": `Here are your upcoming deadlines this week:\n\n🔴 **High Priority**\n• Math Assignment - Due Today, 5:00 PM\n• Essay Draft - Due Wednesday, 11:59 PM\n\n🟡 **Medium Priority**\n• Physics Notes Review - Tomorrow, 10:00 AM\n\n🟢 **Low Priority**\n• Presentation Prep - Friday\n\nYou have 4 tasks pending. Would you like me to help you prioritize them?`,
        "Give me tips for better focus": `Here are research-backed tips to improve your focus:\n\n🧠 **Environment**\n• Find a quiet, dedicated study space\n• Keep your phone in another room\n• Use noise-cancelling headphones\n\n⏰ **Time Management**\n• Work in 25-50 minute focused blocks\n• Take regular 5-10 minute breaks\n• Schedule your hardest tasks during peak energy\n\n🍎 **Health**\n• Stay hydrated (aim for 8 glasses/day)\n• Get 7-9 hours of sleep\n• Exercise for at least 30 minutes daily\n\nWant me to set up focus reminders for you?`,
        "Summarize my recent notes": `Based on your recent activity, here's a summary:\n\n📝 **Physics (Chapter 7)**\n• Key concepts: Wave mechanics, frequency, amplitude\n• Important formulas: v = fλ, E = hf\n\n📝 **Computer Science**\n• Data structures: Arrays, linked lists, trees\n• Algorithms: Sorting, searching complexity\n\n📝 **Literature**\n• Themes in modern poetry\n• Essay outline for comparative analysis\n\nWould you like me to create flashcards from these notes?`,
      };

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          responses[content] ||
          `I understand you're asking about "${content}". Let me help you with that!\n\nAs your AI assistant, I can help you with:\n• Planning and organizing your study schedule\n• Managing tasks and deadlines\n• Providing study tips and resources\n• Answering academic questions\n\nCould you provide more details about what you need?`,
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
