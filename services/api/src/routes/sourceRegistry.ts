import { Router } from 'express';
import { SourceRegistryResponse } from '@voteready/shared';
import { sourceRepository } from '../repositories/sourceRepository.js';

const router = Router();

router.get('/', async (req, res) => {
  const sources = await sourceRepository.getSourceRegistry();
  const response: SourceRegistryResponse = {
    sources: sources,
    count: sources.length,
    generatedAt: new Date().toISOString()
  };
  res.json(response);
});

export default router;
