import express from 'express';
import { rbacGuard, rateLimit, sendAudit, busNotify, kv, vec } from '../lib';
import { getZedStatus, getZedSummary, getZedSettings, putZedSettings, postZedAction } from '../lib/zedHandlers';

const router = express.Router();

router.use(rbacGuard(['owner', 'admin', 'member', 'viewer']));

router.get('/status', getZedStatus);
router.get('/summary', getZedSummary);
router.get('/settings', getZedSettings);
router.put('/settings', putZedSettings);
router.post('/action', rateLimit('zed_action', 20, 60), postZedAction);

export default router;
