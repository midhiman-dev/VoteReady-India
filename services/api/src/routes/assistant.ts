import { Router } from 'express';
import { 
  AssistantRequest, 
  isSupportedLanguage,
  isSupportedExplanationMode,
  createAssistantShellResponse
} from '@voteready/shared';

const router = Router();

router.post('/', (req, res) => {
  const { question, language, explanationMode } = req.body as AssistantRequest;

  // Simple dependency-free validation
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: "Invalid assistant request: question is required." });
  }

  if (!language || !isSupportedLanguage(language)) {
    return res.status(400).json({ error: "Invalid assistant request: language is missing or unsupported." });
  }

  if (!explanationMode || !isSupportedExplanationMode(explanationMode)) {
    return res.status(400).json({ error: "Invalid assistant request: explanationMode is missing or unsupported." });
  }

  const shellResponse = createAssistantShellResponse({
    request: { question, language, explanationMode }
  });

  res.json(shellResponse);
});

export default router;
