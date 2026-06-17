import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (aiClient) return aiClient;

  let apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (apiKey) {
    apiKey = apiKey.trim().replace(/^['"]|['"]$/g, '');
  }

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "" || apiKey === "undefined") {
    throw new Error(
      "GEMINI_API_KEY is not configured yet."
    );
  }

  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  return aiClient;
}

let geminiQuotaExhaustedUntil = 0;

export async function generateContentWithFallback(
  ai: GoogleGenAI,
  contents: any,
  config: any
) {
  if (Date.now() < geminiQuotaExhaustedUntil) {
    throw new Error("RESOURCE_EXHAUSTED (cooldown active)");
  }

  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.1-pro-preview"
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    if (Date.now() < geminiQuotaExhaustedUntil) {
      break;
    }
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config,
        });
        return response;
      } catch (err: any) {
        lastError = err;

        let errStr = "";
        try {
          errStr = (err?.message || "") + " " + JSON.stringify(err) + " " + String(err);
        } catch {
          errStr = (err?.message || "") + " " + String(err || "");
        }
        errStr = errStr.toLowerCase();
        const errMsg = String(err?.message || err || "").toLowerCase();

        const isQuotaError =
          errMsg.includes("quota") ||
          errMsg.includes("exhausted") ||
          errMsg.includes("429") ||
          errStr.includes("quota") ||
          errStr.includes("exhausted") ||
          errStr.includes("429") ||
          err?.status === "RESOURCE_EXHAUSTED" ||
          err?.code === 429 ||
          err?.error?.code === 429 ||
          err?.error?.status === "RESOURCE_EXHAUSTED";

        if (isQuotaError) {
          geminiQuotaExhaustedUntil = Date.now() + 10 * 60 * 1000;
          throw err;
        }

        const isUnavailableError =
          errMsg.includes("503") ||
          errMsg.includes("unavailable") ||
          errMsg.includes("high demand") ||
          errStr.includes("503") ||
          errStr.includes("unavailable") ||
          errStr.includes("high demand") ||
          err?.status === "UNAVAILABLE" ||
          err?.code === 503 ||
          err?.error?.code === 503 ||
          err?.error?.status === "UNAVAILABLE";

        if (isUnavailableError) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw lastError || new Error("All backup models failed.");
}
