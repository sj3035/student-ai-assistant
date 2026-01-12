import { Brain, Database, ListChecks, Sparkles, Settings2, Zap, BookOpen } from "lucide-react";

interface UserPreferences {
  knowledgeLevel?: string;
  explanationStyle?: string;
  responseLength?: string;
  primaryPurpose?: string;
}

interface ContextPanelProps {
  sessionTopic: string;
  detectedMood: string;
  recentActivity: string[];
  messageCount: number;
  userPreferences?: UserPreferences;
}

export function ContextPanel({ 
  sessionTopic, 
  detectedMood, 
  recentActivity, 
  messageCount,
  userPreferences 
}: ContextPanelProps) {
  const getAdaptationMessages = () => {
    const messages: string[] = [];
    
    if (userPreferences?.knowledgeLevel) {
      const levelMap: Record<string, string> = {
        beginner: "Using simplified explanations",
        intermediate: "Balanced technical depth",
        advanced: "Technical language enabled",
        expert: "Expert-level discourse"
      };
      messages.push(levelMap[userPreferences.knowledgeLevel] || "Adapting to your level");
    }
    
    if (userPreferences?.explanationStyle) {
      const styleMap: Record<string, string> = {
        concise: "Keeping responses brief",
        detailed: "Providing detailed context",
        examples: "Including practical examples",
        visual: "Adding visual elements"
      };
      messages.push(styleMap[userPreferences.explanationStyle] || "Matching your style");
    }
    
    if (userPreferences?.primaryPurpose) {
      const purposeMap: Record<string, string> = {
        studying: "Study-focused assistance",
        coding: "Development-oriented help",
        writing: "Writing-focused support",
        research: "Research methodology focus",
        general: "General productivity mode"
      };
      messages.push(purposeMap[userPreferences.primaryPurpose] || "Personalized assistance");
    }
    
    return messages.length > 0 ? messages : ["Learning your preferences..."];
  };

  return (
    <aside className="w-72 border-l border-border bg-surface p-5 hidden xl:block overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Context Panel</h3>
            <p className="text-xs text-muted-foreground">Session insights</p>
          </div>
        </div>

        {/* Personalization Status - Subtle UI cue */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/10">
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Adapting to You</span>
          </div>
          <div className="space-y-2">
            {getAdaptationMessages().map((message, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <Zap className="h-3 w-3 text-primary/70" />
                <span className="text-muted-foreground">{message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Status */}
        <div className="bg-background rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">AI Memory</span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs">
              <Database className="h-3 w-3 text-primary/70" />
              <span className="text-muted-foreground">Preferences stored</span>
              <span className="ml-auto text-primary font-medium text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">Active</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <ListChecks className="h-3 w-3 text-primary/70" />
              <span className="text-muted-foreground">Session context</span>
              <span className="ml-auto text-primary font-medium text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">Tracking</span>
            </div>
          </div>
        </div>

        {/* Current Topic */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" />
            Current Topic
          </div>
          <div className="bg-background rounded-xl p-3 border border-border">
            <p className="text-sm text-foreground font-medium">{sessionTopic}</p>
          </div>
        </div>

        {/* Detected Mood */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Detected State
          </div>
          <div className="bg-background rounded-xl p-3 border border-border">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{getMoodEmoji(detectedMood)}</span>
              <div>
                <span className="text-sm text-foreground capitalize font-medium">{detectedMood}</span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getMoodDescription(detectedMood)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recent Activity
          </div>
          <div className="bg-background rounded-xl p-3 border border-border space-y-2">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{activity}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No recent activity</p>
            )}
          </div>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background rounded-xl p-3 border border-border text-center">
            <p className="text-xl font-bold text-foreground">{messageCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Messages</p>
          </div>
          <div className="bg-background rounded-xl p-3 border border-border text-center">
            <p className="text-xl font-bold text-primary">Active</p>
            <p className="text-xs text-muted-foreground mt-0.5">Status</p>
          </div>
        </div>

        {/* Adaptive Learning Note */}
        <div className="bg-gradient-to-br from-muted/50 to-background rounded-xl p-3 border border-border/50">
          <div className="flex items-start gap-2">
            <span className="text-base">🧠</span>
            <div>
              <p className="text-xs font-medium text-foreground mb-0.5">Continuous Learning</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Responses adapt based on your preferences and conversation history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function getMoodEmoji(mood: string): string {
  const moods: Record<string, string> = {
    focused: "🎯",
    curious: "🤔",
    stressed: "😰",
    relaxed: "😌",
    motivated: "💪",
    neutral: "😊",
  };
  return moods[mood] || "😊";
}

function getMoodDescription(mood: string): string {
  const descriptions: Record<string, string> = {
    focused: "Deep concentration mode",
    curious: "Exploring new ideas",
    stressed: "Consider a brief break",
    relaxed: "Creative thinking optimal",
    motivated: "Ready for challenges",
    neutral: "Open to any task",
  };
  return descriptions[mood] || "Ready to assist";
}
