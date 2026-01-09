import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lightbulb, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, BookOpen, Code, Briefcase, Loader2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TutorialStep {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface PromptExample {
  bad: string;
  good: string;
  explanation: string;
}

const generalTips = [
  {
    title: "Be Specific",
    description: "Instead of vague questions, provide context and details about what you need.",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    title: "Set the Format",
    description: "Request specific formats like bullet points, step-by-step, or summaries.",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    title: "Specify Depth",
    description: "Tell me if you want a brief overview or an in-depth explanation.",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    title: "Ask for Examples",
    description: "Request real-world examples to better understand concepts.",
    icon: <Lightbulb className="h-4 w-4" />,
  },
];

const domainExamples: Record<string, PromptExample[]> = {
  studying: [
    {
      bad: "Explain photosynthesis",
      good: "Explain photosynthesis as if I'm a high school student, include the key stages and a simple diagram description",
      explanation: "Adding context about your level and desired format helps get more relevant answers.",
    },
    {
      bad: "Help me study for my exam",
      good: "Create a study plan for my calculus exam in 5 days. Focus on integration techniques and include practice problem types.",
      explanation: "Specific details about the subject, timeframe, and focus areas lead to actionable guidance.",
    },
  ],
  programming: [
    {
      bad: "Fix my code",
      good: "I'm getting a 'TypeError: undefined is not a function' in my React component when calling useState. Here's my code: [code]. What's wrong?",
      explanation: "Including the error message, context, and actual code helps diagnose issues quickly.",
    },
    {
      bad: "How do I use APIs?",
      good: "Show me how to fetch data from a REST API in JavaScript using async/await, with error handling. Include a practical example.",
      explanation: "Specifying the language, approach, and requesting examples gives you immediately usable code.",
    },
  ],
  general: [
    {
      bad: "Help me be more productive",
      good: "Suggest 5 time management techniques for remote workers who struggle with focus. Include implementation tips for each.",
      explanation: "Narrowing the scope and context leads to more actionable and relevant advice.",
    },
    {
      bad: "Summarize this article",
      good: "Summarize this article in 3 bullet points, focusing on the main argument and key evidence. Keep it under 100 words.",
      explanation: "Specifying length, format, and focus areas ensures you get exactly what you need.",
    },
  ],
};

const IMPROVE_PROMPT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/improve-prompt`;

interface PromptTutorialProps {
  userDomain?: string;
}

export function PromptTutorial({ userDomain = "general" }: PromptTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [improvedPrompt, setImprovedPrompt] = useState<string | null>(null);
  const [isImproving, setIsImproving] = useState(false);

  const domain = userDomain || "general";
  const examples = domainExamples[domain] || domainExamples.general;

  const handleImprovePrompt = async () => {
    if (!userPrompt.trim()) return;

    setIsImproving(true);
    setImprovedPrompt(null);

    try {
      const response = await fetch(IMPROVE_PROMPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          prompt: userPrompt,
          userDomain: domain,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to improve prompt");
      }

      const data = await response.json();
      setImprovedPrompt(data.improvedPrompt);
    } catch (error) {
      console.error("Improve prompt error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to improve prompt");
    } finally {
      setIsImproving(false);
    }
  };

  const handleReset = () => {
    setUserPrompt("");
    setImprovedPrompt(null);
  };

  const steps: TutorialStep[] = [
    {
      id: "intro",
      title: "Welcome to Prompt Writing",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Writing effective prompts is key to getting the best responses from your AI assistant. 
            This tutorial will teach you the fundamentals.
          </p>
          <div className="grid gap-3">
            {generalTips.map((tip, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {tip.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{tip.title}</p>
                  <p className="text-xs text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "comparison",
      title: "Poor vs. Improved Prompts",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            See how small changes can dramatically improve responses:
          </p>
          {examples.map((example, i) => (
            <div key={i} className="space-y-3 p-4 rounded-xl border border-border">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">Before</Badge>
                </div>
                <p className="text-sm bg-destructive/10 p-3 rounded-lg">{example.bad}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs bg-primary">After</Badge>
                </div>
                <p className="text-sm bg-primary/10 p-3 rounded-lg">{example.good}</p>
              </div>
              <p className="text-xs text-muted-foreground italic">💡 {example.explanation}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "domain-tips",
      title: `Tips for ${domain === "studying" ? "Academic" : domain === "programming" ? "Technical" : "General"} Questions`,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            {domain === "studying" && <BookOpen className="h-5 w-5 text-primary" />}
            {domain === "programming" && <Code className="h-5 w-5 text-primary" />}
            {domain === "general" && <Briefcase className="h-5 w-5 text-primary" />}
            <span className="font-medium">Tailored for your usage</span>
          </div>

          {domain === "studying" && (
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Specify your grade level or course</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Ask for study techniques specific to your subject</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Request practice problems with difficulty levels</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Ask me to explain concepts using analogies</li>
            </ul>
          )}

          {domain === "programming" && (
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Always include the programming language</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Share error messages and relevant code</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Specify if you want explanations or just code</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Ask for best practices and edge cases</li>
            </ul>
          )}

          {domain === "general" && (
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Provide context about your situation</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Specify the format you want (list, essay, etc.)</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Set constraints like word count or time</li>
              <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Ask for actionable steps, not just information</li>
            </ul>
          )}
        </div>
      ),
    },
    {
      id: "practice",
      title: "Practice: Improve Your Prompt",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <span className="font-medium">AI-Powered Prompt Improver</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Write a prompt and let AI suggest improvements based on what you've learned.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="user-prompt" className="text-sm">Your prompt:</Label>
            <Textarea
              id="user-prompt"
              placeholder="Type a prompt you'd like to improve..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="resize-none h-20"
            />
          </div>

          {improvedPrompt && (
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Improved version:
              </Label>
              <div className="p-3 rounded-lg bg-primary/10 text-sm">
                {improvedPrompt}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleImprovePrompt}
              disabled={!userPrompt.trim() || isImproving}
              className="flex-1"
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Improve My Prompt
                </>
              )}
            </Button>
            {improvedPrompt && (
              <Button variant="outline" onClick={handleReset}>
                Try Another
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "complete",
      title: "You're All Set!",
      content: (
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Tutorial Complete!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Now you know how to write effective prompts. Start chatting with your AI assistant and put these tips into practice!
            </p>
          </div>
          <div className="bg-muted/50 p-4 rounded-xl text-left">
            <p className="text-sm font-medium mb-2">Quick reference:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✓ Be specific about what you need</li>
              <li>✓ Provide context and background</li>
              <li>✓ Specify the format you want</li>
              <li>✓ Ask for examples when helpful</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!isExpanded) {
    return (
      <Card 
        className="border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors"
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Prompt Writing Tutorial</p>
            <p className="text-xs text-muted-foreground">Learn to write effective prompts</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Prompt Writing Tutorial</CardTitle>
          </div>
          <button 
            onClick={() => setIsExpanded(false)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Minimize
          </button>
        </div>
        <Progress value={progress} className="h-1 mt-3" />
        <CardDescription className="text-xs mt-2">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="min-h-[280px]">
          {steps[currentStep].content}
        </div>
        <div className="flex gap-2 mt-4">
          {currentStep > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button
              size="sm"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex-1"
            >
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="flex-1"
            >
              Done <CheckCircle2 className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
