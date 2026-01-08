import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, BookOpen, Code, Briefcase, GraduationCap, Zap, Settings2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SurveyOption {
  value: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

interface SurveyStep {
  id: string;
  title: string;
  description: string;
  options: SurveyOption[];
}

const surveySteps: SurveyStep[] = [
  {
    id: "primary_purpose",
    title: "What's your primary purpose?",
    description: "Help us understand how you'll use this assistant",
    options: [
      { value: "studying", label: "Studying / Academics", description: "Exam prep, notes, assignments", icon: <GraduationCap className="h-5 w-5" /> },
      { value: "programming", label: "Programming / Technical", description: "Coding, debugging, learning tech", icon: <Code className="h-5 w-5" /> },
      { value: "general", label: "General Productivity", description: "Daily tasks, research, planning", icon: <Briefcase className="h-5 w-5" /> },
    ],
  },
  {
    id: "knowledge_level",
    title: "What's your current knowledge level?",
    description: "This helps us calibrate explanations to your needs",
    options: [
      { value: "beginner", label: "Beginner", description: "Just getting started in this area", icon: <BookOpen className="h-5 w-5" /> },
      { value: "intermediate", label: "Intermediate", description: "Have foundational knowledge", icon: <Zap className="h-5 w-5" /> },
      { value: "advanced", label: "Advanced", description: "Deep expertise in my domain", icon: <Settings2 className="h-5 w-5" /> },
    ],
  },
  {
    id: "explanation_style",
    title: "Preferred explanation style?",
    description: "How technical should my responses be?",
    options: [
      { value: "simple", label: "Simple & Clear", description: "Non-technical, easy to understand" },
      { value: "moderate", label: "Moderately Technical", description: "Balanced with some technical terms" },
      { value: "technical", label: "Highly Technical", description: "Detailed, technical explanations" },
    ],
  },
  {
    id: "response_length",
    title: "Preferred response length?",
    description: "How detailed should my answers be?",
    options: [
      { value: "short", label: "Short & Concise", description: "Quick answers, key points only" },
      { value: "medium", label: "Medium Detail", description: "Balanced explanation with context" },
      { value: "detailed", label: "Detailed Explanations", description: "Comprehensive, thorough responses" },
    ],
  },
  {
    id: "learning_preference",
    title: "How do you learn best?",
    description: "I'll adapt my teaching style to match yours",
    options: [
      { value: "step-by-step", label: "Step-by-Step Guidance", description: "Structured, sequential approach" },
      { value: "examples", label: "Examples First", description: "Learn by seeing practical examples" },
      { value: "theory", label: "Theory First", description: "Understand concepts before applying" },
    ],
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const progress = ((currentStep + 1) / surveySteps.length) * 100;
  const currentSurvey = surveySteps[currentStep];

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentSurvey.id]: value }));
  };

  const handleNext = async () => {
    if (currentStep < surveySteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Complete onboarding
      setIsCompleting(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from("profiles")
            .update({
              primary_purpose: answers.primary_purpose,
              knowledge_level: answers.knowledge_level,
              explanation_style: answers.explanation_style,
              response_length: answers.response_length,
              learning_preference: answers.learning_preference,
              onboarding_completed: true,
            })
            .eq("user_id", user.id);

          if (error) throw error;
        }

        setShowComplete(true);
        setTimeout(() => {
          navigate("/");
        }, 2500);
      } catch (error: any) {
        toast({
          title: "Error saving preferences",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsCompleting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (showComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4">
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">You're all set!</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Your assistant is now personalized based on your preferences. Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Let's personalize your experience</h1>
          <p className="text-sm text-muted-foreground mt-1">Step {currentStep + 1} of {surveySteps.length}</p>
        </div>

        {/* Progress */}
        <Progress value={progress} className="h-1.5 mb-6" />

        {/* Survey Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{currentSurvey.title}</CardTitle>
            <CardDescription>{currentSurvey.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentSurvey.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left",
                  answers[currentSurvey.id] === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                {option.icon && (
                  <div className={cn(
                    "shrink-0 h-10 w-10 rounded-lg flex items-center justify-center",
                    answers[currentSurvey.id] === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {option.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{option.label}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                {answers[currentSurvey.id] === option.value && (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                )}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!answers[currentSurvey.id] || isCompleting}
            className="flex-1"
          >
            {isCompleting
              ? "Saving..."
              : currentStep === surveySteps.length - 1
              ? "Complete Setup"
              : "Continue"}
          </Button>
        </div>

        {/* Skip option */}
        <button
          onClick={() => navigate("/")}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-4 py-2"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
