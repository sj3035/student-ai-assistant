import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lightbulb, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, BookOpen, Code, Briefcase, Loader2, Wand2, Target, Layout, MessageSquare, Layers } from "lucide-react";
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

// Tips adapted for different knowledge levels
const getTipsForLevel = (level: string) => {
  const isBeginnerFriendly = level === "beginner" || level === "intermediate";
  
  return [
    {
      title: "Be Specific",
      description: isBeginnerFriendly 
        ? "Tell me exactly what you need. Instead of 'help me study', say 'help me understand photosynthesis for my biology test'."
        : "Provide precise context, constraints, and expected output format to optimize response quality.",
      icon: <Target className="h-4 w-4" />,
    },
    {
      title: "Set the Format",
      description: isBeginnerFriendly
        ? "Ask for bullet points, step-by-step guides, or summaries — whatever helps you learn best."
        : "Specify structural requirements: bullet points, numbered lists, tables, or prose with defined sections.",
      icon: <Layout className="h-4 w-4" />,
    },
    {
      title: "Specify Depth",
      description: isBeginnerFriendly
        ? "Tell me if you want a quick overview or a detailed explanation. I'll adjust!"
        : "Indicate required granularity: executive summary, comprehensive analysis, or technical deep-dive.",
      icon: <Layers className="h-4 w-4" />,
    },
    {
      title: "Request Examples",
      description: isBeginnerFriendly
        ? "Ask for real-world examples — they make complex ideas much easier to understand."
        : "Request domain-relevant examples, edge cases, or comparative scenarios to enhance understanding.",
      icon: <MessageSquare className="h-4 w-4" />,
    },
  ];
};

// Domain-specific examples
const domainExamples: Record<string, PromptExample[]> = {
  studying: [
    {
      bad: "Explain photosynthesis",
      good: "Explain photosynthesis as if I'm a high school student. Break it into the light and dark reactions, and use an analogy like a factory to help me visualize it.",
      explanation: "Adding your level, structure, and requesting analogies leads to a much clearer explanation.",
    },
    {
      bad: "Help me study for my exam",
      good: "Create a 5-day study plan for my calculus exam. Focus on integration techniques, derivatives, and limits. Include daily goals and practice problem types for each topic.",
      explanation: "Specific subject, timeframe, topics, and format make the plan immediately actionable.",
    },
    {
      bad: "What is mitosis?",
      good: "Explain the stages of mitosis in order. Use simple language suitable for a 10th grader, and give me a memory trick to remember the phase sequence.",
      explanation: "Specifying stage-by-stage breakdown, your level, and a mnemonic request makes learning easier.",
    },
  ],
  programming: [
    {
      bad: "Fix my code",
      good: "I'm getting 'TypeError: undefined is not a function' when calling useState in my React component. Here's my code: [paste code]. What's wrong and how do I fix it?",
      explanation: "Including the exact error message, context, and code enables quick diagnosis.",
    },
    {
      bad: "How do I use APIs?",
      good: "Show me how to fetch data from a REST API in JavaScript using async/await. Include error handling with try-catch and display a loading state. Provide a complete working example.",
      explanation: "Specifying language, approach, requirements, and asking for complete code gives you something you can use immediately.",
    },
    {
      bad: "Explain recursion",
      good: "Explain recursion in Python with a factorial example. Show the base case and recursive case clearly. Then give me a more complex example with a tree traversal.",
      explanation: "Asking for progressive examples from simple to complex builds understanding step by step.",
    },
  ],
  general: [
    {
      bad: "Help me be more productive",
      good: "Suggest 5 time management techniques for remote workers who struggle with distractions. For each technique, explain how to implement it and when it works best.",
      explanation: "Narrowing the context (remote workers + distractions) and requesting implementation details makes advice actionable.",
    },
    {
      bad: "Summarize this article",
      good: "Summarize this article in 3 bullet points, focusing on the main argument and supporting evidence. Keep it under 100 words and highlight any actionable insights.",
      explanation: "Specifying format, length, focus areas, and purpose gets you exactly what you need.",
    },
    {
      bad: "What should I eat?",
      good: "Suggest 5 healthy lunch ideas that take under 20 minutes to prepare. I'm vegetarian and need protein-rich options. Include estimated prep time and main ingredients.",
      explanation: "Adding constraints (time, dietary needs) and requesting specific details makes recommendations practical.",
    },
  ],
};

const IMPROVE_PROMPT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/improve-prompt`;

interface PromptTutorialProps {
  userDomain?: string;
  userKnowledgeLevel?: string;
}

export function PromptTutorial({ 
  userDomain = "general",
  userKnowledgeLevel = "intermediate" 
}: PromptTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPrompt, setUserPrompt] = useState("");
  const [improvedPrompt, setImprovedPrompt] = useState<string | null>(null);
  const [isImproving, setIsImproving] = useState(false);

  const domain = userDomain === "studying" ? "studying" : 
                 userDomain === "programming" ? "programming" : "general";
  const examples = domainExamples[domain] || domainExamples.general;
  const tips = getTipsForLevel(userKnowledgeLevel);
  
  const isBeginnerFriendly = userKnowledgeLevel === "beginner" || userKnowledgeLevel === "intermediate";

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

  const getDomainIcon = () => {
    switch (domain) {
      case "studying": return <BookOpen className="h-5 w-5 text-primary" />;
      case "programming": return <Code className="h-5 w-5 text-primary" />;
      default: return <Briefcase className="h-5 w-5 text-primary" />;
    }
  };

  const getDomainTitle = () => {
    switch (domain) {
      case "studying": return "Study-Related";
      case "programming": return "Programming";
      default: return "General Productivity";
    }
  };

  const steps: TutorialStep[] = [
    {
      id: "intro",
      title: isBeginnerFriendly ? "What Makes a Good Prompt?" : "Prompt Engineering Fundamentals",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {isBeginnerFriendly 
              ? "The way you ask questions determines how helpful my answers are. Better prompts = better responses! Let me show you how."
              : "Effective prompting is the key to maximizing AI utility. The following principles will help you craft high-quality inputs that yield precise, actionable outputs."}
          </p>
          <div className="grid gap-3">
            {tips.map((tip, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
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
      title: isBeginnerFriendly ? "Before vs After Examples" : "Prompt Optimization Patterns",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            {isBeginnerFriendly 
              ? "See how small changes make a big difference:"
              : "Analyze these transformations to understand the structural improvements:"}
          </p>
          {examples.map((example, i) => (
            <div key={i} className="space-y-3 p-4 rounded-xl border border-border bg-card">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">
                    {isBeginnerFriendly ? "❌ Vague" : "Suboptimal"}
                  </Badge>
                </div>
                <p className="text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">{example.bad}</p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs bg-primary">
                    {isBeginnerFriendly ? "✓ Clear & Specific" : "Optimized"}
                  </Badge>
                </div>
                <p className="text-sm bg-primary/10 p-3 rounded-lg border border-primary/20">{example.good}</p>
              </div>
              <p className="text-xs text-muted-foreground flex items-start gap-2 pt-1">
                <Lightbulb className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                {example.explanation}
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "domain-tips",
      title: `${getDomainTitle()} Prompts`,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            {getDomainIcon()}
            <span className="font-medium">
              {isBeginnerFriendly 
                ? "Tips customized for your focus area"
                : "Domain-specific optimization strategies"}
            </span>
          </div>

          {domain === "studying" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                {isBeginnerFriendly 
                  ? "When asking study questions, here's what helps me help you:"
                  : "Academic prompting best practices:"}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Tell me your grade level or course name" : "Specify educational level and curriculum context"}
                </li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Ask for study techniques that match your subject" : "Request subject-specific pedagogical approaches"}
                </li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Request practice problems with easy, medium, hard levels" : "Define difficulty progression for practice materials"}
                </li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Ask me to use analogies or real-world examples" : "Request conceptual mappings to familiar domains"}
                </li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Ask for memory tricks or mnemonics" : "Request mnemonic devices for retention optimization"}
                </li>
              </ul>
            </div>
          )}

          {domain === "programming" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                {isBeginnerFriendly 
                  ? "When asking coding questions, include:"
                  : "Technical prompting best practices:"}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Always mention the programming language" : "Specify language, version, and framework context"}
                </li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Copy-paste the exact error message" : "Include complete error traces with line numbers"}
                </li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Share the relevant code snippet" : "Provide minimal reproducible code examples"}
                </li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Say if you want explanation, just code, or both" : "Specify output format: documentation, implementation, or hybrid"}
                </li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Ask about edge cases and best practices" : "Request edge case handling and pattern adherence"}
                </li>
              </ul>
            </div>
          )}

          {domain === "general" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                {isBeginnerFriendly 
                  ? "For productivity and general questions:"
                  : "General productivity prompting strategies:"}
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Describe your situation and constraints" : "Provide complete situational context and constraints"}
                </li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Tell me the format you want (list, essay, steps)" : "Specify desired output structure and format"}
                </li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Set limits like word count or number of ideas" : "Define scope parameters: length, quantity, depth"}
                </li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Ask for actionable steps, not just information" : "Request implementation-focused recommendations"}
                </li>
                <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                  {isBeginnerFriendly ? "Mention your experience level with the topic" : "Indicate prior knowledge for calibrated responses"}
                </li>
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "practice",
      title: isBeginnerFriendly ? "Try It Yourself!" : "Interactive Prompt Refinement",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <span className="font-medium">AI-Powered Prompt Improver</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {isBeginnerFriendly 
              ? "Write any prompt and I'll show you how to make it better based on what you've learned."
              : "Input a prompt to see AI-generated optimization suggestions applying the principles covered."}
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="user-prompt" className="text-sm">Your prompt:</Label>
            <Textarea
              id="user-prompt"
              placeholder={isBeginnerFriendly 
                ? "Type any question or request you'd like to improve..."
                : "Enter a prompt for optimization analysis..."}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="resize-none h-24"
            />
          </div>

          {improvedPrompt && (
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {isBeginnerFriendly ? "Here's a better version:" : "Optimized prompt:"}
              </Label>
              <div className="p-4 rounded-lg bg-primary/10 text-sm border border-primary/20">
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
                  {isBeginnerFriendly ? "Improving..." : "Analyzing..."}
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isBeginnerFriendly ? "Improve My Prompt" : "Optimize Prompt"}
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
      title: isBeginnerFriendly ? "You're All Set!" : "Tutorial Complete",
      content: (
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {isBeginnerFriendly ? "You're Ready!" : "Congratulations!"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isBeginnerFriendly 
                ? "Now you know how to ask better questions. Start chatting and put these tips into practice!"
                : "You've mastered the fundamentals of effective prompting. Apply these principles consistently for optimal results."}
            </p>
          </div>
          <div className="bg-muted/50 p-4 rounded-xl text-left border border-border/50">
            <p className="text-sm font-medium mb-2">
              {isBeginnerFriendly ? "Quick reminder:" : "Key takeaways:"}
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                {isBeginnerFriendly ? "Be specific about what you need" : "Provide precise context and constraints"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                {isBeginnerFriendly ? "Give context about your situation" : "Include relevant background information"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                {isBeginnerFriendly ? "Ask for the format you want" : "Specify output structure requirements"}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                {isBeginnerFriendly ? "Request examples when helpful" : "Request domain-relevant examples"}
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Prompt Writing Guide</CardTitle>
              <CardDescription className="text-xs">
                {isBeginnerFriendly 
                  ? "Learn to get better AI responses"
                  : "Master effective AI prompting techniques"}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {currentStep + 1}/{steps.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-1.5 mt-4" />
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="font-semibold mb-3">{steps[currentStep].title}</h3>
        <div className="min-h-[320px]">
          {steps[currentStep].content}
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
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
              onClick={() => setCurrentStep(0)}
              className="flex-1"
            >
              Start Over <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
