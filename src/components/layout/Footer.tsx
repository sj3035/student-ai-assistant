import mindForgeLogo from "@/assets/mindforge-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-3 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <img 
            src={mindForgeLogo} 
            alt="MindForge Logo" 
            className="h-7 w-7 object-contain"
          />
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground text-sm">MindForge</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">Think. Build. Evolve.</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            Powered by <span className="font-medium text-primary">Neurix AI</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>© {new Date().getFullYear()} MindForge</span>
        </div>
      </div>
    </footer>
  );
}
