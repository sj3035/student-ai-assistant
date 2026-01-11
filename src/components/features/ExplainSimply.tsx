import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sparkles, BookOpen, Loader2, Zap, Layers, MessageCircle, GraduationCap, RotateCcw, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ExplainOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const explainOptions: ExplainOption[] = [
  {
    id: "new",
    label: "Explain like I'm new to this",
    description: "Simple, beginner-friendly explanation with no assumptions",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  {
    id: "analogy",
    label: "Use real-world analogies",
    description: "Learn through familiar comparisons and scenarios",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    id: "minimal",
    label: "Avoid technical jargon",
    description: "Plain language explanation, no specialized terms",
    icon: <MessageCircle className="h-4 w-4" />,
  },
  {
    id: "technical",
    label: "Increase technical depth",
    description: "Detailed, comprehensive explanation with precise terminology",
    icon: <Layers className="h-4 w-4" />,
  },
];

interface ExplainSimplyProps {
  userKnowledgeLevel?: string;
  userDomain?: string;
  onExplain?: (topic: string, style: string, adaptToBackground: boolean) => void;
}

const EXPLAIN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/explain`;

export function ExplainSimply({ 
  userKnowledgeLevel = "intermediate", 
  userDomain = "general",
  onExplain 
}: ExplainSimplyProps) {
  const [topic, setTopic] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [adaptToBackground, setAdaptToBackground] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get friendly labels for user profile
  const getKnowledgeLevelLabel = (level: string) => {
    switch (level) {
      case "beginner": return "Beginner";
      case "intermediate": return "Intermediate";
      case "advanced": return "Advanced";
      case "expert": return "Expert";
      default: return level;
    }
  };

  const getDomainLabel = (domain: string) => {
    switch (domain) {
      case "studying": return "Student";
      case "programming": return "Developer";
      case "general": return "General";
      default: return domain;
    }
  };

  const streamExplanation = async (action: "explain" | "simpler" | "examples" = "explain") => {
    if (!topic.trim() || !selectedOption) return;

    setIsLoading(true);
    if (action === "explain") {
      setExplanation(null);
    }

    try {
      const response = await fetch(EXPLAIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          topic,
          style: selectedOption,
          adaptToBackground,
          userKnowledgeLevel: adaptToBackground ? userKnowledgeLevel : undefined,
          userDomain: adaptToBackground ? userDomain : undefined,
          action,
          previousExplanation: action !== "explain" ? explanation : undefined,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a moment.");
        }
        if (response.status === 402) {
          throw new Error("AI credits exhausted. Please add credits to continue.");
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get explanation");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let explanationText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              explanationText += content;
              setExplanation(explanationText);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (onExplain) {
        onExplain(topic, selectedOption, adaptToBackground);
      }
    } catch (error) {
      console.error("Explain error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get explanation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplain = () => streamExplanation("explain");
  const handleSimpler = () => streamExplanation("simpler");
  const handleMoreExamples = () => streamExplanation("examples");

  const handleReset = () => {
    setTopic("");
    setSelectedOption(null);
    setExplanation(null);
  };

  const getSelectedOptionLabel = () => {
    return explainOptions.find((o) => o.id === selectedOption)?.label || "";
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Explain It Simply</CardTitle>
            <CardDescription className="text-sm">Get clear explanations adapted to your level</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {!explanation ? (
          <>
            {/* Topic Input */}
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-sm font-medium">What would you like explained?</Label>
              <Textarea
                id="topic"
                placeholder="Enter any topic, concept, term, or question..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="resize-none h-24 text-base"
              />
            </div>

            {/* Explanation Style Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">How should I explain it?</Label>
              <div className="grid gap-2">
                {explainOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border text-left transition-all",
                      selectedOption === option.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      selectedOption === option.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Personalization Section */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Personalization settings
                  </span>
                  <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvanced && "rotate-180")} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="adapt"
                        checked={adaptToBackground}
                        onCheckedChange={setAdaptToBackground}
                      />
                      <Label htmlFor="adapt" className="text-sm font-medium cursor-pointer">
                        Adapt to my background
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground ml-11">
                      Customize explanation based on your profile settings
                    </p>
                  </div>
                  {adaptToBackground && (
                    <div className="flex gap-1.5">
                      <Badge variant="secondary" className="text-xs">
                        {getKnowledgeLevelLabel(userKnowledgeLevel)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {getDomainLabel(userDomain)}
                      </Badge>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Explain Button */}
            <Button
              onClick={handleExplain}
              disabled={!topic.trim() || !selectedOption || isLoading}
              className="w-full h-11 text-base"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating explanation...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Explain This
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Explanation Result */}
            <div className="space-y-4">
              {/* Topic and style badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {topic.length > 40 ? topic.substring(0, 40) + "..." : topic}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getSelectedOptionLabel()}
                </Badge>
                {adaptToBackground && (
                  <Badge variant="secondary" className="text-xs">
                    Personalized
                  </Badge>
                )}
              </div>
              
              {/* Explanation content */}
              <div className="p-5 rounded-xl bg-muted/30 border border-border/50">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {explanation}
                    {isLoading && (
                      <span className="inline-block w-2 h-4 bg-primary/50 animate-pulse ml-1 rounded-sm" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Refine the explanation:</p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSimpler} 
                    disabled={isLoading}
                    className="flex-1 min-w-[120px]"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Zap className="h-3 w-3 mr-1.5" />
                        Make Simpler
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleMoreExamples} 
                    disabled={isLoading}
                    className="flex-1 min-w-[120px]"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-3 w-3 mr-1.5" />
                        Add Examples
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleReset} 
                    disabled={isLoading}
                    className="flex-1 min-w-[120px]"
                  >
                    <RotateCcw className="h-3 w-3 mr-1.5" />
                    New Topic
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
