import express from 'express';
import cors from 'cors';
import { 
  APP_NAME, 
  APP_VERSION, 
  TAGLINE, 
  HealthResponse, 
  AppMetadataResponse, 
  SourceRegistryResponse, 
  INITIAL_SOURCE_REGISTRY,
  AppEnvironment,
  LanguagePreference,
  ExplanationMode,
  AssistantRequest,
  AssistantResponse
} from '@voteready/shared';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

/**
 * Safely maps NODE_ENV to validated AppEnvironment label.
 */
function getAppEnvironment(): AppEnvironment {
  const env = process.env.NODE_ENV;
  if (env === 'production') return 'production';
  if (env === 'staging') return 'staging';
  if (env === 'development') return 'development';
  return 'local';
}

app.get('/', (req, res) => {
  res.json({
    message: "VoteReady India API Ready",
    version: APP_VERSION
  });
});

app.get('/health', (req, res) => {
  const health: HealthResponse = {
    ok: true,
    service: "voteready-api",
    version: APP_VERSION,
    timestamp: new Date().toISOString()
  };
  res.json(health);
});

app.get('/metadata', (req, res) => {
  const supportedLanguages: LanguagePreference[] = ["english", "simple_english", "hinglish", "hindi"];
  const supportedExplanationModes: ExplanationMode[] = ["quick", "simple", "detailed"];

  const metadata: AppMetadataResponse = {
    appName: APP_NAME,
    tagline: TAGLINE,
    apiVersion: APP_VERSION,
    environment: getAppEnvironment(),
    supportedLanguages,
    supportedExplanationModes,
    generatedAt: new Date().toISOString()
  };
  res.json(metadata);
});

app.get('/source-registry', (req, res) => {
  const response: SourceRegistryResponse = {
    sources: INITIAL_SOURCE_REGISTRY,
    count: INITIAL_SOURCE_REGISTRY.length,
    generatedAt: new Date().toISOString()
  };
  res.json(response);
});

app.post('/assistant/mock', (req, res) => {
  const { question, language, explanationMode } = req.body as AssistantRequest;

  // Simple dependency-free validation
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: "Invalid assistant mock request: question is required." });
  }

  const supportedLanguages: LanguagePreference[] = ["english", "simple_english", "hinglish", "hindi"];
  const supportedExplanationModes: ExplanationMode[] = ["quick", "simple", "detailed"];

  if (!language || !supportedLanguages.includes(language)) {
    return res.status(400).json({ error: "Invalid assistant mock request: language is missing or unsupported." });
  }

  if (!explanationMode || !supportedExplanationModes.includes(explanationMode)) {
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

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
