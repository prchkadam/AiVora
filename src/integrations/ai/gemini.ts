import { GoogleGenAI } from '@google/genai';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

const MODEL = 'gemini-2.5-pro';

function getApiKey(): string | undefined {
  // Prefer standard Node env var, fallback to Vite-style import.meta.env when running in that environment
  if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  // @ts-ignore - import.meta exists in some build environments (Vite)
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) {
    return (import.meta as any).env.VITE_GEMINI_API_KEY;
  }
  return undefined;
}

function getClient() {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY / VITE_GEMINI_API_KEY');
  return new GoogleGenAI({ apiKey });
}

function makeSystemInstruction(): string {
  return (
    `You are an AI that generates high-quality multiple-choice quiz questions.\n` +
    `Output must conform to the provided JSON schema (application/json).\n` +
    `Rules:\n` +
    `- Include a concise explanation for why the correct answer is correct.\n` +
    `- Do NOT include any text outside the JSON array.\n` +
    `- Options must be diverse and not repetitive.\n` +
    `- The answer must always exist in the options.\n` +
    `- Output exactly the number of questions requested.`
  );
}

function safelyParseJsonFromResponse(resp: any): any {
  if (!resp) throw new Error('Empty response from model');

  if (resp.json) return resp.json;
  if (resp.response && typeof resp.response === 'object') {
    if (resp.response?.json) return resp.response.json;
    if (typeof resp.response?.text === 'string') {
      return JSON.parse(resp.response.text);
    }
  }

  if (typeof resp.text === 'string') {
    const blockMatch = resp.text.match(/```json\s*([\s\S]*?)\s*```/i);
    const jsonStr = blockMatch ? blockMatch[1] : resp.text;
    return JSON.parse(jsonStr);
  }

  const candidateText = resp?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof candidateText === 'string') return JSON.parse(candidateText);

  throw new Error('Could not parse JSON from model response');
}

async function generateWithRetry(args: {
  contents: any[];
  config: any;
  maxRetries?: number;
  baseDelayMs?: number;
}) {
  const { contents, config, maxRetries = 3, baseDelayMs = 800 } = args;
  let attempt = 0;
  let lastError: any;
  while (attempt <= maxRetries) {
    try {
      const ai = getClient();
      return await ai.models.generateContent({
        model: MODEL,
        contents,
        config,
      });
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || '');
      const shouldRetry = /503|UNAVAILABLE|overloaded|timeout|rate/i.test(msg) && attempt < maxRetries;
      if (!shouldRetry) break;
      const delay = baseDelayMs * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
      attempt++;
    }
  }
  throw lastError;
}

export async function generateQuiz(category: string, difficulty: string, count = 8): Promise<{ questions: Question[] }> {
  const systemInstruction = makeSystemInstruction();

  const userInstruction = `Generate ${count} MCQ questions about ${category} at ${difficulty} difficulty level.\n` +
    `Return only a JSON array of objects in this exact shape:\n\n` +
    `[{\n  "question": "",\n  "options": ["", "", "", ""],\n  "answer": "",\n  "explanation": ""\n}]`;

  const responseSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        question: { type: 'string' },
        options: { type: 'array', items: { type: 'string' }, minItems: 4, maxItems: 4 },
        answer: { type: 'string' },
        explanation: { type: 'string' },
      },
      required: ['question', 'options', 'answer', 'explanation'],
    },
    minItems: count,
    maxItems: count,
  } as const;

  const contents = [
    { role: 'user', parts: [{ text: systemInstruction }] },
    { role: 'user', parts: [{ text: userInstruction }] },
  ];

  const resp = await generateWithRetry({
    contents,
    config: {
      temperature: 0.7,
      responseMimeType: 'application/json',
      responseSchema,
    },
  });

  const parsed = safelyParseJsonFromResponse(resp);
  if (!Array.isArray(parsed)) throw new Error('Invalid quiz format (expected array)');

  const arr = parsed.slice(0, count);
  const questions: Question[] = arr.map((q: any) => ({
    question: String(q?.question ?? ''),
    options: Array.isArray(q?.options) ? q.options.map((o: any) => String(o)) : [],
    correctAnswer: String(q?.answer ?? ''),
    explanation: String(q?.explanation ?? ''),
  }));

  if (questions.some(q => !q.question || q.options.length !== 4 || !q.correctAnswer || !q.options.includes(q.correctAnswer))) {
    throw new Error('Quiz validation failed');
  }

  return { questions };
}

export async function generateFeedback(params: {
  score: number;
  category: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  explanation: string;
}): Promise<{
  feedback: string;
  learnMore: {
    title: string;
    summary: string;
    actionSteps: string[];
  };
}> {
  const { score, category, difficulty, totalQuestions, correctAnswers , explanation } = params;

  const systemInstruction = `You are an AI that provides concise, encouraging quiz feedback AND a short follow-up learning guide. Output JSON ONLY with fields 'feedback' and 'learnMore'.`;

  const userInstruction = `Create a short feedback paragraph (max 120 words) plus a "learnMore" follow-up plan. Return ONLY JSON in this exact shape:\n\n{\n  "feedback": "...",
  "learnMore": {
    "title": "...",
    "summary": "...",
    "actionSteps": ["...", "..."]
  }
}\n\nDetails:\n- Category: ${category}\n- Difficulty: ${difficulty}\n- Total Questions: ${totalQuestions}\n- Correct Answers: ${correctAnswers}\n- Score: ${score}\n- Explanation: ${explanation}\nRules:\n- actionSteps must be 2-3 concise strings with concrete practice ideas.\n- summary should be <= 60 words.`;

  const responseSchema = {
    type: 'object',
    properties: {
      feedback: { type: 'string' },
      learnMore: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' },
          actionSteps: {
            type: 'array',
            items: { type: 'string' },
            minItems: 2,
            maxItems: 3,
          },
        },
        required: ['title', 'summary', 'actionSteps'],
      },
    },
    required: ['feedback', 'learnMore'],
  } as const;

  const contents = [
    { role: 'user', parts: [{ text: systemInstruction }] },
    { role: 'user', parts: [{ text: userInstruction }] },
  ];

  const resp = await generateWithRetry({
    contents,
    config: {
      temperature: 0.6,
      responseMimeType: 'application/json',
      responseSchema,
    },
  });

  const parsed = safelyParseJsonFromResponse(resp);
  if (
    !parsed ||
    typeof parsed.feedback !== 'string' ||
    !parsed.learnMore ||
    typeof parsed.learnMore.title !== 'string' ||
    typeof parsed.learnMore.summary !== 'string' ||
    !Array.isArray(parsed.learnMore.actionSteps)
  ) {
    throw new Error('Invalid feedback format');
  }

  return {
    feedback: parsed.feedback,
    learnMore: {
      title: parsed.learnMore.title,
      summary: parsed.learnMore.summary,
      actionSteps: parsed.learnMore.actionSteps.map((step: any) => String(step)).slice(0, 3),
    },
  };
}
