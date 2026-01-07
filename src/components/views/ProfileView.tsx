import { Mail, GraduationCap, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileView() {
  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">User Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
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
