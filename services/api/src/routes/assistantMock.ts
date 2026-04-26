import { Router } from 'express';
import { 
  AssistantRequest, 
  AssistantResponse,
  isSupportedLanguage,
  isSupportedExplanationMode
} from '@voteready/shared';

const router = Router();

router.post('/', (req, res) => {
  const { question, language, explanationMode } = req.body as AssistantRequest;

  // Simple dependency-free validation
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: "Invalid assistant mock request: question is required." });
  }

  if (!language || !isSupportedLanguage(language)) {
    return res.status(400).json({ error: "Invalid assistant mock request: language is missing or unsupported." });
  }

  if (!explanationMode || !isSupportedExplanationMode(explanationMode)) {
    return res.status(400).json({ error: "Invalid assistant mock request: explanationMode is missing or unsupported." });
  }

  const mockResponse: AssistantResponse = {
    id: `mock-${new Date().toISOString()}`,
    status: "cannot_verify",
    language,
    explanationMode,
    answerBlocks: [
      {
        type: "short_answer",
        heading: "Mock assistant endpoint",
        content: "The assistant API contract is connected. Real source-backed election guidance will be added in a later task."
      },
      {
        type: "source_note",
        heading: "Source status",
        content: "No procedural answer has been generated. This response is only a safe contract test."
      }
    ],
    sources: [],
    generatedAt: new Date().toISOString(),
    freshnessSummary: {
      status: "review_due",
      message: "Source-backed guidance is not active in this mock endpoint."
    },
    disclaimer: "This is a mock response for development only."
  };

  res.json(mockResponse);
});

export default router;
