import { Bell, Moon, Globe, Shield, HelpCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const settingsSections = [
  {
    title: "Notifications",
    icon: Bell,
    settings: [
      { label: "Push Notifications", description: "Get notified about tasks and reminders", enabled: true },
      { label: "Email Digest", description: "Weekly summary of your productivity", enabled: false },
      { label: "Task Reminders", description: "Remind me before deadlines", enabled: true },
    ],
  },
  {
    title: "Appearance",
    icon: Moon,
    settings: [
      { label: "Dark Mode", description: "Use dark theme for the interface", enabled: false },
      { label: "Compact View", description: "Show more content with less spacing", enabled: false },
    ],
  },
  {
    title: "Language & Region",
    icon: Globe,
    settings: [
      { label: "Language", description: "English (US)", enabled: true },
      { label: "24-hour Time", description: "Use 24-hour time format", enabled: false },
    ],
  },
  {
    title: "Privacy & Security",
    icon: Shield,
    settings: [
      { label: "Two-Factor Auth", description: "Add extra security to your account", enabled: false },
      { label: "Data Sharing", description: "Share usage data to improve the app", enabled: true },
    ],
  },
];

export function SettingsView() {
  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your assistant experience</p>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.settings.map((setting, index) => (
                  <div
                    key={setting.label}
                    className={`flex items-center justify-between py-3 ${
                      index < section.settings.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{setting.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Help section */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Help & Support</h2>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left py-3 text-sm text-foreground hover:text-primary transition-colors border-b border-border">
              FAQ & Documentation
            </button>
            <button className="w-full text-left py-3 text-sm text-foreground hover:text-primary transition-colors border-b border-border">
              Contact Support
            </button>
            <button className="w-full text-left py-3 text-sm text-foreground hover:text-primary transition-colors">
              Send Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
