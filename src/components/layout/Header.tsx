import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import mindForgeLogo from "@/assets/mindforge-logo.png";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <img 
            src={mindForgeLogo} 
            alt="MindForge Logo" 
            className="h-8 w-8 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground leading-tight">MindForge</span>
            <span className="text-[10px] text-muted-foreground leading-tight">Think. Build. Evolve.</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-sm font-medium text-muted-foreground">S</span>
        </div>
      </div>
    </header>
  );
}
