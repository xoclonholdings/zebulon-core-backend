import express from 'express';
import chatRoutes from './routes/chat';

const ZedAppRouter = express.Router();
ZedAppRouter.use('/', chatRoutes);
ZedAppRouter.get('/health', (req, res) => res.json({ status: 'ok' }));
ZedAppRouter.get('/version', (req, res) => res.json({ version: '1.0.0' }));

export { ZedAppRouter };
