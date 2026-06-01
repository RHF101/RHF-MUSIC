import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

let geminiClient: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
}

export async function generateResponse(prompt: string, context?: string): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

  const systemContext = context
    ? `You are an AI assistant for RHF MUSIC, a premium music streaming platform. Context: ${context}\n\n`
    : "You are an AI assistant for RHF MUSIC, a premium music streaming platform. You can help manage songs, playlists, and user data.\n\n";

  const result = await model.generateContent(systemContext + prompt);
  const response = result.response;
  return response.text();
}
