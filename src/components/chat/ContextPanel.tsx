import { Brain, Database, ListChecks, Sparkles } from "lucide-react";

interface ContextPanelProps {
  sessionTopic: string;
  detectedMood: string;
  recentActivity: string[];
  messageCount: number;
}

export function ContextPanel({ 
  sessionTopic, 
  detectedMood, 
  recentActivity, 
  messageCount 
}: ContextPanelProps) {
  return (
    <aside className="w-72 border-l border-border bg-surface p-4 hidden xl:block overflow-y-auto">
      <div className="space-y-5">
        {/* Session info header */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Context Panel</h3>
        </div>

        {/* Memory Status Compact */}
        <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">AI Memory</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Database className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">Long-term preferences</span>
              <span className="ml-auto text-primary font-medium">Stored</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <ListChecks className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">Active task context</span>
              <span className="ml-auto text-primary font-medium">3 tasks</span>
            </div>
          </div>
        </div>

        {/* Current topic */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <Brain className="h-3.5 w-3.5" />
            Session Topic
          </div>
          <div className="bg-background rounded-lg p-3 border border-border">
            <p className="text-sm text-foreground">{sessionTopic}</p>
          </div>
        </div>

        {/* Detected mood */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Detected Mood
          </div>
          <div className="bg-background rounded-lg p-3 border border-border">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getMoodEmoji(detectedMood)}</span>
              <span className="text-sm text-foreground capitalize">{detectedMood}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getMoodDescription(detectedMood)}
            </p>
          </div>
        </div>

        {/* Recent activity */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Recent Activity
          </div>
          <div className="bg-background rounded-lg p-3 border border-border space-y-2">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">{activity}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No recent activity</p>
            )}
          </div>
        </div>

        {/* Session stats */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Session Stats
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background rounded-lg p-3 border border-border text-center">
              <p className="text-lg font-semibold text-foreground">{messageCount}</p>
              <p className="text-xs text-muted-foreground">Messages</p>
            </div>
            <div className="bg-background rounded-lg p-3 border border-border text-center">
              <p className="text-lg font-semibold text-primary">Active</p>
              <p className="text-xs text-muted-foreground">Status</p>
            </div>
          </div>
        </div>

        {/* Adaptation note */}
        <div className="bg-surface rounded-lg p-3 border border-border">
          <p className="text-xs text-primary font-medium mb-1">
            🧠 Adaptive Learning
          </p>
          <p className="text-xs text-muted-foreground">
            Your assistant learns from interactions and adapts responses based on your preferences and context.
          </p>
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
    focused: "You seem concentrated and productive",
    curious: "You're asking exploratory questions",
    stressed: "Consider taking a short break",
    relaxed: "Great state for creative thinking",
    motivated: "Perfect time to tackle big tasks",
    neutral: "Ready for any type of task",
  };
  return descriptions[mood] || "Ready to help with whatever you need";
}
