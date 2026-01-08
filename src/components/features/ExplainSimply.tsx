import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sparkles, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleExplain = async () => {
    if (!topic.trim() || !selectedOption) return;

    setIsLoading(true);
    
    // Simulate AI response - in production, this would call the actual AI
    setTimeout(() => {
      const option = explainOptions.find((o) => o.id === selectedOption);
      const adaptedContext = adaptToBackground
        ? `As a ${userKnowledgeLevel} in ${userDomain}, `
        : "";
      
      setExplanation(
        `${adaptedContext}here's an explanation of "${topic}":\n\n` +
        `This is where the AI-generated explanation would appear based on your selected style: "${option?.label}". ` +
        `The explanation would be tailored to your ${userKnowledgeLevel} knowledge level ` +
        `and ${userDomain} background.\n\n` +
        `In the full implementation, this would use Lovable AI to generate contextual, ` +
        `personalized explanations based on your preferences.`
      );
      setIsLoading(false);
      
      if (onExplain) {
        onExplain(topic, selectedOption, adaptToBackground);
      }
    }, 1500);
  };

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
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset} className="flex-1">
                  New Explanation
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Make Simpler
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Add Examples
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
