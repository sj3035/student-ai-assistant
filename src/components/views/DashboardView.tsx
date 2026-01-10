import { useEffect, useState } from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  Target, 
  Zap,
  Brain,
  Database,
  ListChecks
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface DayStats {
  day: string;
  date: string;
  interactions: number;
}

interface DashboardStats {
  totalMessages: number;
  todayMessages: number;
  weekMessages: number;
  weeklyData: DayStats[];
}

export function DashboardView() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    todayMessages: 0,
    weekMessages: 0,
    weeklyData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // Get all messages for the user
        const { data: messages, error } = await supabase
          .from("chat_messages")
          .select("created_at, role")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - 6);

        // Calculate stats
        const totalMessages = messages?.length || 0;
        const todayMessages = messages?.filter(m => 
          new Date(m.created_at) >= todayStart
        ).length || 0;
        const weekMessages = messages?.filter(m => 
          new Date(m.created_at) >= weekStart
        ).length || 0;

        // Build weekly data
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyData: DayStats[] = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(todayStart);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayMessages = messages?.filter(m => {
            const msgDate = new Date(m.created_at).toISOString().split('T')[0];
            return msgDate === dateStr;
          }).length || 0;

          weeklyData.push({
            day: days[date.getDay()],
            date: dateStr,
            interactions: dayMessages,
          });
        }

        setStats({
          totalMessages,
          todayMessages,
          weekMessages,
          weeklyData,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('dashboard-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const maxInteractions = Math.max(...stats.weeklyData.map(d => d.interactions), 1);
  const userName = profile?.name || "there";

  const statCards = [
    { label: "Total Messages", value: stats.totalMessages.toString(), icon: MessageSquare, change: "All time" },
    { label: "Today's Activity", value: stats.todayMessages.toString(), icon: Clock, change: "Messages today" },
    { label: "This Week", value: stats.weekMessages.toString(), icon: TrendingUp, change: "Last 7 days" },
    { label: "Conversations", value: Math.ceil(stats.totalMessages / 2).toString(), icon: CheckCircle2, change: "Approx. exchanges" },
  ];

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto overflow-y-auto h-full">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 bg-muted rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto overflow-y-auto h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {userName}</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your AI assistant usage</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Memory Indicator */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-5 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Memory Status</h3>
            <p className="text-sm text-muted-foreground">Your assistant remembers and adapts</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-background/60 rounded-lg p-3">
            <Database className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Personalization</p>
              <p className="text-xs text-muted-foreground">
                {profile?.knowledge_level ? `${profile.knowledge_level} level` : "Not set"} • {profile?.explanation_style || "Default style"}
              </p>
            </div>
            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
              {profile?.onboarding_completed ? "Active" : "Pending"}
            </span>
          </div>
          <div className="flex items-center gap-3 bg-background/60 rounded-lg p-3">
            <ListChecks className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Chat History</p>
              <p className="text-xs text-muted-foreground">{stats.totalMessages} messages saved</p>
            </div>
            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
              Stored
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Interaction Summary */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Weekly Activity</h3>
            </div>
            <span className="text-sm text-muted-foreground">{stats.weekMessages} messages</span>
          </div>
          {stats.weekMessages === 0 ? (
            <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
              No activity this week. Start chatting to see your stats!
            </div>
          ) : (
            <div className="flex items-end justify-between gap-2 h-32">
              {stats.weeklyData.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-primary rounded-t-md transition-all hover:bg-primary/80"
                    style={{ 
                      height: `${(day.interactions / maxInteractions) * 100}%`,
                      minHeight: day.interactions > 0 ? '8px' : '2px'
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage Summary */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Usage Summary</h3>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground font-medium">Weekly Goal</span>
                <span className="text-muted-foreground">{stats.weekMessages} / 50 messages</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all" 
                  style={{ width: `${Math.min((stats.weekMessages / 50) * 100, 100)}%` }} 
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xl font-semibold text-foreground">{stats.todayMessages}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xl font-semibold text-foreground">{stats.weekMessages}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-xl font-semibold text-foreground">{stats.totalMessages}</p>
                <p className="text-xs text-muted-foreground">All Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Quick Tips</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Explain Simply</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Use the "Explain It Simply" feature to break down complex topics
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Chat History</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your conversations are saved automatically between sessions
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Personalized</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Responses are tailored to your knowledge level and preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
