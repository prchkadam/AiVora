import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, difficulty, type, score, totalQuestions, correctAnswers } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Generate feedback instead of questions
    if (type === "feedback") {
      const feedbackPrompt = `Generate encouraging and constructive feedback for a quiz taker who scored ${score}% (${correctAnswers} out of ${totalQuestions} questions correct) on a ${difficulty} level ${category} quiz. Keep it concise (2-3 sentences), positive, and motivating. Include specific advice for improvement if the score is below 80%.`;

      const response = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content:
                  "You are an encouraging quiz tutor who provides constructive feedback.",
              },
              {
                role: "user",
                content: feedbackPrompt,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI Gateway error:", response.status, errorText);
        throw new Error(`AI Gateway returned ${response.status}`);
      }

      const data = await response.json();
      const feedback = data.choices[0].message.content;

      return new Response(JSON.stringify({ feedback }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate quiz questions
    const prompt = `Generate 5 ${difficulty} difficulty multiple-choice questions about ${category}. 
    
    Return ONLY a valid JSON array with this exact structure (no markdown, no extra text):
    [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct option text",
        "explanation": "Brief explanation of the correct answer"
      }
    ]
    
    Requirements:
    - Exactly 5 questions
    - Each question must have exactly 4 options
    - correctAnswer must match one of the options exactly
    - Questions should be appropriate for ${difficulty} difficulty level
    - Focus on ${category} topic`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You are a quiz generator. Return only valid JSON arrays without any markdown formatting or additional text.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway returned ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;

    // Clean up the response - remove markdown code blocks if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    // Parse the JSON
    const questions = JSON.parse(content);

    // Validate the structure
    if (!Array.isArray(questions) || questions.length !== 5) {
      throw new Error("Invalid questions format");
    }

    console.log("Generated questions:", JSON.stringify(questions, null, 2));

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-quiz function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
