
import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

// ZLab summary endpoint for dashboard tile
const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
	try {
		// Find the demo workspace
		const ws = await prisma.workspace.findFirst({ where: { name: 'ZLab Sandbox' } });
		if (!ws) return res.status(404).json({ error: 'Demo workspace not found' });
		// Get projects, tasks, meetings
		const projects = await prisma.project.findMany({ where: { workspaceId: ws.id } });
		const tasks = await prisma.task.findMany({ where: { projectId: { in: projects.map(p => p.id) } } });
		const meetings = await prisma.meeting.findMany({ where: { workspaceId: ws.id } });
		res.json({
			projects: projects.map(p => p.name),
			tasks: tasks.map(t => ({ name: t.title, status: t.statusColId ? 'in progress' : 'todo' })),
			meetings: meetings.map(m => ({ topic: m.title, time: m.startsAt ? m.startsAt : 'TBD' })),
		});
	} catch (e) {
		res.status(500).json({ error: 'Failed to fetch ZLab summary', details: e.message });
	}
});

import browser from './browser';
import projects from './projects';
import meetings from './meetings';
import notes from './notes';
import files from './files';
import search from './search';
import presence from './presence';
import activity from './activity';
import perms from './perms';



router.use('/browser', browser);
router.use('/projects', projects);
router.use('/meetings', meetings);
router.use('/notes', notes);
router.use('/files', files);
router.use('/search', search);
router.use('/presence', presence);
router.use('/activity', activity);
router.use('/perms', perms);

export default router;
