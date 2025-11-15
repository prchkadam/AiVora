// @deno-types="https://deno.land/x/types/deno.d.ts"
// @ts-ignore - Deno types are available in the runtime
/// <reference no-default-lib="true" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.window" />

// @ts-ignore - Deno types are available in the runtime
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

// Add global Deno type
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Type definitions
interface QuizRequest {
  category: string;
  difficulty: string;
  type: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// Deno types are available by default in Supabase Edge Functions

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// @ts-ignore - This is a valid Deno.serve handler
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const body = await req.json() as QuizRequest;
    const { category, difficulty, type, score, totalQuestions, correctAnswers } = body;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Generate feedback instead of questions
    if (type === "feedback") {
      try {
        const feedbackPrompt = `Generate encouraging and constructive feedback for a quiz taker who scored ${score}% (${correctAnswers} out of ${totalQuestions} questions correct) on a ${difficulty} level ${category} quiz. Keep it concise (2-3 sentences), positive, and motivating. Include specific advice for improvement if the score is below 80%.
        
        Also provide a short learning plan with 2-3 action items in the following JSON format:
        {
          "feedback": "Your feedback here",
          "learnMore": {
            "title": "How to improve",
            "summary": "Brief summary of improvement areas",
            "actionSteps": ["Step 1", "Step 2", "Step 3"]
          }
        }`;

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
              response_format: { type: "json_object" },
              messages: [
                {
                  role: "system",
                  content: "You are an encouraging quiz tutor who provides constructive feedback. Always respond with valid JSON that includes both feedback and learning suggestions."
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
          throw new Error(`AI Gateway returned ${response.status}: ${errorText}`);
        }

        const data = await response.json() as AIResponse;
        
        // Handle different response structures
        let feedbackContent: any;
        if (data.choices && data.choices[0]?.message?.content) {
          // Handle standard response format
          const content = data.choices[0].message.content;
          try {
            // Try to parse if content is a JSON string
            feedbackContent = typeof content === 'string' ? JSON.parse(content) : content;
          } catch (e) {
            // If not JSON, use as plain text feedback
            feedbackContent = {
              feedback: content,
              learnMore: {
                title: "Tips for Improvement",
                summary: "Here are some general tips to help you improve:",
                actionSteps: [
                  "Review the questions you got wrong",
                  `Explore more about ${category}`, 
                  "Take the quiz again to reinforce your knowledge"
                ]
              }
            };
          }
        } else {
          throw new Error("Unexpected response format from AI service");
        }

        return new Response(JSON.stringify(feedbackContent), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error generating feedback:", error);
        // Return a helpful fallback response
        return new Response(JSON.stringify({
          feedback: "Great job on completing the quiz! Keep practicing to improve your score.",
          learnMore: {
            title: "How to improve",
            summary: "Here are some general tips to help you improve:",
            actionSteps: [
              "Review the questions you got wrong",
              `Explore more about ${category}`,
              "Take the quiz again to reinforce your knowledge"
            ]
          }
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
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

    const data = await response.json() as AIResponse;
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
