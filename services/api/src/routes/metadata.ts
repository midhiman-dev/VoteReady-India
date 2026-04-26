import { Router } from 'express';
import { 
  AppMetadataResponse, 
  APP_NAME, 
  TAGLINE, 
  APP_VERSION, 
  LanguagePreference, 
  ExplanationMode,
  SUPPORTED_LANGUAGES,
  SUPPORTED_EXPLANATION_MODES
} from '@voteready/shared';
import { getAppEnvironment } from '../utils/environment.js';

const router = Router();

router.get('/', (req, res) => {
  const metadata: AppMetadataResponse = {
    appName: APP_NAME,
    tagline: TAGLINE,
    apiVersion: APP_VERSION,
    environment: getAppEnvironment(),
    supportedLanguages: SUPPORTED_LANGUAGES,
    supportedExplanationModes: SUPPORTED_EXPLANATION_MODES,
    generatedAt: new Date().toISOString()
  };
  res.json(metadata);
});

export default router;
