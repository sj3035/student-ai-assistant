import { Plus, Calendar, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

const tasks = [
  { id: 1, title: "Complete Math Assignment", due: "Today", priority: "high", completed: false },
  { id: 2, title: "Review Physics Notes", due: "Tomorrow", priority: "medium", completed: false },
  { id: 3, title: "Submit Essay Draft", due: "Wed", priority: "high", completed: false },
  { id: 4, title: "Prepare Presentation", due: "Fri", priority: "low", completed: false },
  { id: 5, title: "Read Chapter 5", due: "Yesterday", priority: "medium", completed: true },
  { id: 6, title: "Lab Report", due: "2 days ago", priority: "high", completed: true },
];

const priorityColors = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-primary/10 text-primary",
  low: "bg-muted text-muted-foreground",
};

export function TasksView() {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tasks & Reminders</h1>
          <p className="text-muted-foreground mt-1">Manage your assignments and deadlines</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Pending tasks */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Pending ({pendingTasks.length})
        </h2>
        <div className="space-y-2">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-sm transition-shadow"
            >
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Circle className="h-5 w-5" />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{task.due}</span>
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${priorityColors[task.priority]}`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Completed tasks */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Completed ({completedTasks.length})
        </h2>
        <div className="space-y-2">
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-4 p-4 bg-muted/50 border border-border rounded-xl opacity-60"
            >
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-through">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{task.due}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
