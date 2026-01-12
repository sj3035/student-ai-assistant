import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import mindForgeLogo from "@/assets/mindforge-logo.png";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { profile, user } = useAuth();
  
  const initials = profile?.name 
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header className="h-[var(--header-height)] border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2.5">
          <img 
            src={mindForgeLogo} 
            alt="MindForge Logo" 
            className="h-9 w-9 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-orbitron font-bold text-foreground tracking-wider text-lg uppercase">MindForge</span>
            <span className="font-orbitron text-[9px] text-muted-foreground font-medium tracking-[0.2em] uppercase">Think. Build. Evolve.</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative hover:bg-muted">
          <Bell className="h-4.5 w-4.5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full" />
        </Button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-soft">
          <span className="text-sm font-semibold text-primary-foreground">{initials}</span>
        </div>
      </div>
    </header>
  );
}
