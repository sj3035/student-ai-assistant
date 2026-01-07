import { Mail, GraduationCap, Calendar, Award, Brain, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type ResponseStyle = "short" | "detailed";
type UsageMode = "study" | "coding" | "general";

export function ProfileView() {
  const [responseStyle, setResponseStyle] = useState<ResponseStyle>("detailed");
  const [usageMode, setUsageMode] = useState<UsageMode>("study");

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto overflow-y-auto h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">User Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and AI preferences</p>
      </div>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-3xl font-semibold text-primary">S</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">Student User</h2>
            <p className="text-muted-foreground">Computer Science Major</p>
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                student@university.edu
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                Junior Year
              </div>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </div>
      </div>

      {/* AI Personalization */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Personalization</h3>
            <p className="text-sm text-muted-foreground">Customize how your assistant responds</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Response Style */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Preferred Response Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setResponseStyle("short")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  responseStyle === "short"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    responseStyle === "short" ? "border-primary" : "border-muted-foreground"
                  }`}>
                    {responseStyle === "short" && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="font-medium text-foreground">Short & Concise</span>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  Brief, to-the-point answers for quick understanding
                </p>
              </button>
              <button
                onClick={() => setResponseStyle("detailed")}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  responseStyle === "detailed"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    responseStyle === "detailed" ? "border-primary" : "border-muted-foreground"
                  }`}>
                    {responseStyle === "detailed" && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="font-medium text-foreground">Detailed & Thorough</span>
                </div>
                <p className="text-xs text-muted-foreground pl-6">
                  In-depth explanations with examples and context
                </p>
              </button>
            </div>
          </div>

          {/* Usage Mode */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Primary Usage Mode
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "study", label: "Study", desc: "Academic focus", icon: "📚" },
                { id: "coding", label: "Coding", desc: "Dev assistance", icon: "💻" },
                { id: "general", label: "General", desc: "All-purpose", icon: "🎯" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setUsageMode(mode.id as UsageMode)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    usageMode === mode.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl mb-2 block">{mode.icon}</span>
                  <span className="font-medium text-foreground block">{mode.label}</span>
                  <span className="text-xs text-muted-foreground">{mode.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-5 text-center">
          <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-semibold text-foreground">142</p>
          <p className="text-sm text-muted-foreground">Days Active</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 text-center">
          <Award className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-semibold text-foreground">89</p>
          <p className="text-sm text-muted-foreground">Tasks Completed</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 text-center">
          <GraduationCap className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-semibold text-foreground">3.8</p>
          <p className="text-sm text-muted-foreground">GPA</p>
        </div>
      </div>

      {/* Academic info */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Academic Information</h3>
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">University</span>
            <span className="text-foreground font-medium">State University</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Major</span>
            <span className="text-foreground font-medium">Computer Science</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Expected Graduation</span>
            <span className="text-foreground font-medium">May 2026</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Credits Completed</span>
            <span className="text-foreground font-medium">92 / 120</span>
          </div>
        </div>
      </div>
    </div>
  );
}
