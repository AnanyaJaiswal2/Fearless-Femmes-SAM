import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { interests, strengths, education, workStyle } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are a career counselor for women in India. Based on the user's profile, recommend 3-5 careers. Return a JSON array where each object has:
- "title": career name
- "matchReason": why it matches (1-2 sentences)
- "requiredSkills": array of 4-6 skills
- "salaryRange": India-based estimate like "₹6-12 LPA"
- "growthScope": 1-2 sentences
- "nextSteps": array of 3-4 actionable steps
Return ONLY valid JSON array, no markdown.`
          },
          {
            role: "user",
            content: `Profile:
Interests: ${interests}
Strengths: ${strengths}
Education: ${education}
Preferred Work Style: ${workStyle}`
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let careers;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      careers = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch {
      careers = { error: "Failed to parse", raw: content };
    }

    return new Response(JSON.stringify(careers), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("career-guide error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
