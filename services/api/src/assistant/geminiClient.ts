import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiConfig } from "../config/gemini.js";
import { SourceRecord, SourceFragment, LanguagePreference, ExplanationMode } from "@voteready/shared";

export interface GeminiRequest {
  question: string;
  sources: SourceRecord[];
  fragments: SourceFragment[];
  language: LanguagePreference;
  explanationMode: ExplanationMode;
}

/**
 * Server-side Gemini client wrapper with timeout and safe error fallback.
 */
export async function callGemini(
  params: GeminiRequest,
  config: GeminiConfig
): Promise<string> {
  if (!config.enabled || !config.apiKeyPresent) {
    throw new Error("Gemini is not configured or disabled.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: config.model });

  const prompt = buildGroundedPrompt(params);

  // Implement timeout using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const result = await model.generateContent(prompt, {
      signal: controller.signal,
    });
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error("Gemini returned an empty response.");
    }

    return text;
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message?.includes('deadline')) {
      throw new Error(`Gemini request timed out after ${config.timeoutMs}ms`);
    }
    console.error("Gemini API Error:", error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildGroundedPrompt(params: GeminiRequest): string {
  const fragmentContext = params.fragments
    .map((f, i) => `[Fragment ${i + 1} from ${f.sourceId}]: ${f.content}`)
    .join("\n\n");

  const sourceContext = params.sources
    .map((s, i) => `[Source ${i + 1}]: ${s.title} (${s.url || 'No URL'})`)
    .join("\n\n");

  return `
    You are VoteReady India, a trusted civic education assistant for young Indian voters.
    Your goal is to provide accurate, neutral, and easy-to-understand information about voting in India.

    GROUNDING CONTEXT FROM OFFICIAL SOURCES:
    ${fragmentContext || "No specific source fragments available."}

    SOURCE REGISTRY METADATA:
    ${sourceContext || "No specific source metadata available."}

    USER QUESTION:
    "${params.question}"

    STRICT GUIDELINES:
    1. Base your answer ONLY on the provided GROUNDING CONTEXT and SOURCE REGISTRY METADATA.
    2. If the answer is not contained in the context, your response MUST be exactly: [CANNOT_VERIFY]
    3. NEVER invent procedural guidance (dates, form names, eligibility rules) if not explicitly in the context.
    4. Maintain a strictly politically neutral tone. Do not express opinions or recommend candidates/parties.
    5. Answer in ${params.language}.
    6. Explanation style: ${params.explanationMode}.
    7. If the question is about a specific political party or candidate, your response MUST be exactly: [OUT_OF_SCOPE]

    FORMATTING:
    - Use clear, conversational language.
    - If explaining a process, use bulleted steps.
    - If applicable, highlight a clear "Next Step" for the user.
    - Keep the response concise but helpful.
  `;
}
