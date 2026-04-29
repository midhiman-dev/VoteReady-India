import { Router } from 'express';
import { 
  AssistantRequest, 
  isSupportedLanguage,
  isSupportedExplanationMode
} from '@voteready/shared';
import { orchestrateAssistantResponse } from '../assistant/orchestrator.js';

const router = Router();

router.post('/', async (req, res) => {
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

  try {
    const shellResponse = await orchestrateAssistantResponse({
      request: { question, language, explanationMode }
    });

    res.json(shellResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal assistant error" });
  }
});

export default router;

