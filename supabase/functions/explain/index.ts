import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExplainRequest {
  topic: string;
  style: string;
  adaptToBackground: boolean;
  userKnowledgeLevel?: string;
  userDomain?: string;
  action?: "explain" | "simpler" | "examples";
  previousExplanation?: string;
}

function buildSystemPrompt(request: ExplainRequest): string {
  let prompt = `You are MindForge's explanation assistant. Your purpose is to make any topic understandable. Be clear, direct, and well-structured.`;

  // Adapt based on style
  switch (request.style) {
    case "new":
      prompt += ` STYLE: Explain like I'm completely new. Start from absolute basics, use everyday language, define every term, build concepts step by step.`;
      break;
    case "analogy":
      prompt += ` STYLE: Use real-world analogies. Center explanations around relatable comparisons from everyday life (cooking, driving, sports). Make analogies the main teaching tool.`;
      break;
    case "minimal":
      prompt += ` STYLE: Avoid technical jargon. Use plain everyday words only. If a technical term is unavoidable, define it immediately. Focus on "what it does" not "what it's called".`;
      break;
    case "technical":
      prompt += ` STYLE: Increase technical depth. Provide comprehensive explanations with proper terminology. Include nuances, edge cases, and connections to related concepts.`;
      break;
  }

  // Adapt to user background
  if (request.adaptToBackground && request.userKnowledgeLevel) {
    const levels: Record<string, string> = {
      beginner: ` USER LEVEL: Beginner - Use extremely simple language, many everyday examples, explain why things matter.`,
      intermediate: ` USER LEVEL: Intermediate - Balance accessibility with depth, can reference common concepts.`,
      advanced: ` USER LEVEL: Advanced - Can use technical language, focus on nuances and deeper insights.`,
      expert: ` USER LEVEL: Expert - Assume strong foundations, focus on cutting-edge details and subtleties.`,
    };
    prompt += levels[request.userKnowledgeLevel] || "";
  }

  if (request.adaptToBackground && request.userDomain) {
    const domains: Record<string, string> = {
      studying: ` CONTEXT: Student - Frame in learning terms, include memory aids.`,
      programming: ` CONTEXT: Developer - Can use programming analogies, appreciate logical structure.`,
      general: ` CONTEXT: General user - Use universally relatable examples.`,
    };
    prompt += domains[request.userDomain] || ` Use examples from ${request.userDomain} when possible.`;
  }

  return prompt;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: ExplainRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = buildSystemPrompt(request);
    
    let userMessage = "";
    if (request.action === "simpler" && request.previousExplanation) {
      userMessage = `The following explanation was too complex. Please make it even simpler and more accessible:\n\n"${request.previousExplanation}"`;
    } else if (request.action === "examples" && request.previousExplanation) {
      userMessage = `Please add more practical, real-world examples to this explanation:\n\n"${request.previousExplanation}"`;
    } else {
      userMessage = `Please explain: ${request.topic}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Explain error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
