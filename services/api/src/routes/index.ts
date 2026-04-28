import { Router } from 'express';
import healthRouter from './health.js';
import metadataRouter from './metadata.js';
import sourceRegistryRouter from './sourceRegistry.js';
import assistantMockRouter from './assistantMock.js';
import assistantRouter from './assistant.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/metadata', metadataRouter);
router.use('/source-registry', sourceRegistryRouter);
router.use('/assistant/mock', assistantMockRouter);
router.use('/assistant', assistantRouter);


export default router;
