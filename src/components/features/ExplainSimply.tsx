import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sparkles, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ExplainOption {
  id: string;
  label: string;
  description: string;
  prompt: string;
}

const explainOptions: ExplainOption[] = [
  {
    id: "new",
    label: "Explain like I'm new to this",
    description: "Simple, beginner-friendly explanation",
    prompt: "Explain this concept as if I'm completely new to the topic. Use simple language and avoid jargon.",
  },
  {
    id: "minimal",
    label: "Minimal technical terms",
    description: "Keep it accessible and clear",
    prompt: "Explain this with minimal technical terms. Focus on the core idea in plain language.",
  },
  {
    id: "examples",
    label: "Real-world examples",
    description: "Learn through practical scenarios",
    prompt: "Explain this concept using real-world examples and analogies that make it easy to understand.",
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

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Explain It Simply</CardTitle>
            <CardDescription className="text-xs">Get clear explanations adapted to your level</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!explanation ? (
          <>
            {/* Topic Input */}
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-sm">What would you like explained?</Label>
              <Textarea
                id="topic"
                placeholder="Enter a topic, concept, or question..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="resize-none h-20"
              />
            </div>

            {/* Explanation Style Options */}
            <div className="space-y-2">
              <Label className="text-sm">Choose explanation style</Label>
              <div className="grid gap-2">
                {explainOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
                      selectedOption === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                      selectedOption === option.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}>
                      {option.id === "new" && <BookOpen className="h-4 w-4" />}
                      {option.id === "minimal" && <Sparkles className="h-4 w-4" />}
                      {option.id === "examples" && <Lightbulb className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Adapt Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Switch
                  id="adapt"
                  checked={adaptToBackground}
                  onCheckedChange={setAdaptToBackground}
                />
                <Label htmlFor="adapt" className="text-sm cursor-pointer">
                  Adjust explanation to my background
                </Label>
              </div>
              {adaptToBackground && (
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs">{userKnowledgeLevel}</Badge>
                  <Badge variant="secondary" className="text-xs">{userDomain}</Badge>
                </div>
              )}
            </div>

            {/* Explain Button */}
            <Button
              onClick={handleExplain}
              disabled={!topic.trim() || !selectedOption || isLoading}
              className="w-full"
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
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{topic}</Badge>
                <Badge variant="outline">
                  {explainOptions.find((o) => o.id === selectedOption)?.label}
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-sm leading-relaxed whitespace-pre-wrap">
                {explanation}
                {isLoading && <span className="inline-block w-2 h-4 bg-primary/50 animate-pulse ml-1" />}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset} className="flex-1" disabled={isLoading}>
                  New Explanation
                </Button>
                <Button variant="outline" size="sm" onClick={handleSimpler} className="flex-1" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Make Simpler"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleMoreExamples} className="flex-1" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add Examples"}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
