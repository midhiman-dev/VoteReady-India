import { Router } from 'express';
import { HealthResponse, APP_VERSION } from '@voteready/shared';

const router = Router();

router.get('/', (req, res) => {
  const health: HealthResponse = {
    ok: true,
    service: "voteready-api",
    version: APP_VERSION,
    timestamp: new Date().toISOString()
  };
  res.json(health);
});

export default router;
