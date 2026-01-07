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

const stats = [
  { label: "Tasks Completed", value: "12", icon: CheckCircle2, change: "+3 today" },
  { label: "Study Hours", value: "24h", icon: Clock, change: "This week" },
  { label: "Courses Active", value: "5", icon: BookOpen, change: "In progress" },
  { label: "Productivity", value: "85%", icon: TrendingUp, change: "+12% vs last week" },
];

const recentTasks = [
  { title: "Complete Math Assignment", due: "Today, 5:00 PM", status: "pending" },
  { title: "Review Physics Notes", due: "Tomorrow, 10:00 AM", status: "pending" },
  { title: "Submit Essay Draft", due: "Wed, 11:59 PM", status: "pending" },
];

const weeklyData = [
  { day: "Mon", interactions: 12, tasks: 3 },
  { day: "Tue", interactions: 8, tasks: 2 },
  { day: "Wed", interactions: 15, tasks: 4 },
  { day: "Thu", interactions: 10, tasks: 2 },
  { day: "Fri", interactions: 18, tasks: 5 },
  { day: "Sat", interactions: 5, tasks: 1 },
  { day: "Sun", interactions: 7, tasks: 2 },
];

const usagePatterns = [
  { label: "Study Planning", percentage: 35, color: "bg-primary" },
  { label: "Task Management", percentage: 28, color: "bg-primary/70" },
  { label: "Note Summarization", percentage: 22, color: "bg-primary/50" },
  { label: "General Queries", percentage: 15, color: "bg-primary/30" },
];

export function DashboardView() {
  const maxInteractions = Math.max(...weeklyData.map(d => d.interactions));
  const totalWeeklyInteractions = weeklyData.reduce((sum, d) => sum + d.interactions, 0);
  const totalWeeklyTasks = weeklyData.reduce((sum, d) => sum + d.tasks, 0);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto overflow-y-auto h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, Student</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your productivity and AI assistant insights</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
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
              <p className="text-sm font-medium text-foreground">Long-term Preferences</p>
              <p className="text-xs text-muted-foreground">Response style, usage mode, learning patterns</p>
            </div>
            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
              Stored
            </span>
          </div>
          <div className="flex items-center gap-3 bg-background/60 rounded-lg p-3">
            <ListChecks className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Active Task Context</p>
              <p className="text-xs text-muted-foreground">3 pending tasks, current study session</p>
            </div>
            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Interaction Summary */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Weekly Interactions</h3>
            </div>
            <span className="text-sm text-muted-foreground">{totalWeeklyInteractions} total</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary/20 rounded-t-md transition-all hover:bg-primary/30"
                  style={{ 
                    height: `${(day.interactions / maxInteractions) * 100}%`,
                    minHeight: '8px'
                  }}
                >
                  <div 
                    className="w-full bg-primary rounded-t-md"
                    style={{ height: `${(day.tasks / day.interactions) * 100}%`, minHeight: '4px' }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-xs text-muted-foreground">Tasks ({totalWeeklyTasks})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-primary/20" />
              <span className="text-xs text-muted-foreground">Interactions</span>
            </div>
          </div>
        </div>

        {/* Task Completion Progress */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Task Completion</h3>
            </div>
            <span className="text-sm text-muted-foreground">This week</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground font-medium">Weekly Goal</span>
                <span className="text-muted-foreground">19 / 25 tasks</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: "76%" }} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 bg-surface rounded-lg">
                <p className="text-xl font-semibold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center p-3 bg-surface rounded-lg">
                <p className="text-xl font-semibold text-foreground">7</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div className="text-center p-3 bg-surface rounded-lg">
                <p className="text-xl font-semibold text-foreground">6</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assistant Usage Patterns */}
      <div className="bg-card border border-border rounded-xl p-5 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Assistant Usage Patterns</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {usagePatterns.map((pattern) => (
            <div key={pattern.label} className="bg-surface rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">{pattern.label}</span>
                <span className="text-sm font-semibold text-primary">{pattern.percentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${pattern.color} rounded-full transition-all`} 
                  style={{ width: `${pattern.percentage}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming tasks */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Tasks</h2>
        <div className="space-y-3">
          {recentTasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded border-2 border-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.due}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                Pending
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
