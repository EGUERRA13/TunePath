import { ParseGeminiResponse } from "./parseresponse";
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function RunGemini(artistName) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = artistName

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  ParseGeminiResponse(text);

  return text;
}

