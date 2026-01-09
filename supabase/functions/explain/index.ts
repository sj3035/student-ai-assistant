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
  let prompt = `You are an expert educator who excels at explaining complex topics simply. Your goal is to make concepts accessible and understandable.`;

  // Adapt based on style
  if (request.style === "new") {
    prompt += ` Explain as if the user is completely new to this topic. Use simple, everyday language and avoid all jargon. Start with the absolute basics.`;
  } else if (request.style === "minimal") {
    prompt += ` Use minimal technical terms. Focus on the core idea and make it accessible to anyone.`;
  } else if (request.style === "examples") {
    prompt += ` Lead with real-world examples and analogies. Make abstract concepts concrete through practical scenarios.`;
  }

  // Adapt to user background if enabled
  if (request.adaptToBackground && request.userKnowledgeLevel) {
    if (request.userKnowledgeLevel === "beginner") {
      prompt += ` The user is a beginner, so keep everything extremely simple and provide lots of context.`;
    } else if (request.userKnowledgeLevel === "intermediate") {
      prompt += ` The user has intermediate knowledge, so you can build on some assumed basics.`;
    } else if (request.userKnowledgeLevel === "advanced") {
      prompt += ` The user is advanced, so focus on depth and nuance while still being clear.`;
    }
  }

  if (request.adaptToBackground && request.userDomain) {
    prompt += ` The user's primary domain is ${request.userDomain}, so use relevant examples from that field when possible.`;
  }

  prompt += ` Structure your explanation clearly. Be helpful and encouraging.`;

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
