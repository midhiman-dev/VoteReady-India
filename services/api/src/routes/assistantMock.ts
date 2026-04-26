import { Router } from 'express';
import { 
  AssistantRequest, 
  AssistantResponse,
  isSupportedLanguage,
  isSupportedExplanationMode,
  createMockAssistantResponse
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

  const mockResponse = createMockAssistantResponse({
    request: { question, language, explanationMode }
  });

  res.json(mockResponse);
});

export default router;
