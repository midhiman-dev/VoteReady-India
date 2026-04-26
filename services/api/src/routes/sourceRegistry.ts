import { Router } from 'express';
import { SourceRegistryResponse, INITIAL_SOURCE_REGISTRY } from '@voteready/shared';

const router = Router();

router.get('/', (req, res) => {
  const response: SourceRegistryResponse = {
    sources: INITIAL_SOURCE_REGISTRY,
    count: INITIAL_SOURCE_REGISTRY.length,
    generatedAt: new Date().toISOString()
  };
  res.json(response);
});

export default router;
