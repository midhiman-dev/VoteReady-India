import { Router } from 'express';
import { 
  AppMetadataResponse, 
  APP_NAME, 
  TAGLINE, 
  APP_VERSION, 
  LanguagePreference, 
  ExplanationMode 
} from '@voteready/shared';
import { getAppEnvironment } from '../utils/environment.js';

const router = Router();

export const SUPPORTED_LANGUAGES: LanguagePreference[] = ["english", "simple_english", "hinglish", "hindi"];
export const SUPPORTED_EXPLANATION_MODES: ExplanationMode[] = ["quick", "simple", "detailed"];

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
