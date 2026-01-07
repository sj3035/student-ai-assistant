import { BookOpen, CheckCircle2, Clock, TrendingUp } from "lucide-react";

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

export function DashboardView() {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, Student</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your productivity</p>
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
