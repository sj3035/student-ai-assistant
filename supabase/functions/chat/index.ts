import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  primary_purpose: string | null;
  knowledge_level: string | null;
  explanation_style: string | null;
  response_length: string | null;
  learning_preference: string | null;
}

function buildSystemPrompt(profile: UserProfile | null): string {
  let basePrompt = `You are a personalized AI study assistant designed for students. You are helpful, encouraging, and focused on learning outcomes.`;

  if (!profile) {
    return basePrompt + ` Provide clear, balanced explanations suitable for a general audience.`;
  }

  // Adapt based on primary purpose
  if (profile.primary_purpose === "studying") {
    basePrompt += ` The user is focused on academic learning and studying. Emphasize educational concepts, study strategies, and exam preparation.`;
  } else if (profile.primary_purpose === "programming") {
    basePrompt += ` The user is learning programming and technical skills. Include code examples, technical explanations, and practical implementations.`;
  } else if (profile.primary_purpose === "productivity") {
    basePrompt += ` The user wants to improve productivity. Focus on actionable advice, time management, and efficient workflows.`;
  }

  // Adapt based on knowledge level
  if (profile.knowledge_level === "beginner") {
    basePrompt += ` The user is a beginner. Use simple language, avoid jargon, and explain concepts from the ground up. Include analogies and real-world examples.`;
  } else if (profile.knowledge_level === "intermediate") {
    basePrompt += ` The user has intermediate knowledge. You can use some technical terms but explain complex concepts when needed.`;
  } else if (profile.knowledge_level === "advanced") {
    basePrompt += ` The user is advanced. You can use technical language and assume foundational knowledge. Focus on depth and nuance.`;
  }

  // Adapt based on explanation style
  if (profile.explanation_style === "simple") {
    basePrompt += ` Use very simple, non-technical language. Break down everything into easy-to-understand pieces.`;
  } else if (profile.explanation_style === "moderate") {
    basePrompt += ` Use moderate technical depth. Balance accessibility with precision.`;
  } else if (profile.explanation_style === "technical") {
    basePrompt += ` Use precise, technical language. Be thorough and accurate.`;
  }

  // Adapt based on response length
  if (profile.response_length === "short") {
    basePrompt += ` Keep responses short and concise. Get to the point quickly.`;
  } else if (profile.response_length === "medium") {
    basePrompt += ` Provide medium-length responses with adequate detail.`;
  } else if (profile.response_length === "detailed") {
    basePrompt += ` Provide detailed, comprehensive explanations.`;
  }

  // Adapt based on learning preference
  if (profile.learning_preference === "step-by-step") {
    basePrompt += ` Structure explanations as step-by-step guides. Number your steps clearly.`;
  } else if (profile.learning_preference === "examples") {
    basePrompt += ` Lead with examples first, then explain the underlying concepts.`;
  } else if (profile.learning_preference === "theory") {
    basePrompt += ` Start with theory and foundational concepts before moving to applications.`;
  }

  return basePrompt;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = buildSystemPrompt(profile);

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
          ...messages,
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
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
