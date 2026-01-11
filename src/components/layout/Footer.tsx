import mindForgeLogo from "@/assets/mindforge-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-4 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img 
            src={mindForgeLogo} 
            alt="MindForge Logo" 
            className="h-8 w-8 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-foreground">MindForge</span>
            <span className="text-xs text-muted-foreground">Think. Build. Evolve.</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Powered by <span className="font-medium text-primary">Neurix AI</span>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} MindForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
