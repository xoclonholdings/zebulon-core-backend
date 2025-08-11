import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = Router();

// Get all projects for a workspace
router.get('/workspaces/:id/projects', async (req, res) => {
	const { id } = req.params;
	const projects = await prisma.project.findMany({
		where: { workspaceId: id },
		include: { columns: true, tasks: true },
	});
	res.json({ ok: true, projects });
});

// Create a new project in a workspace
router.post('/workspaces/:id/projects', async (req, res) => {
	const { id } = req.params;
	const { name, description } = req.body;
	const project = await prisma.project.create({
		data: { workspaceId: id, name, description },
	});
	res.json({ ok: true, project });
});

// Get a single project
router.get('/projects/:pid', async (req, res) => {
	const { pid } = req.params;
	const project = await prisma.project.findUnique({
		where: { id: pid },
		include: { columns: true, tasks: true },
	});
	res.json({ ok: true, project });
});

// Update a project
router.patch('/projects/:pid', async (req, res) => {
	const { pid } = req.params;
	const { name, description } = req.body;
	const project = await prisma.project.update({
		where: { id: pid },
		data: { name, description },
	});
	res.json({ ok: true, project });
});

// Delete a project
router.delete('/projects/:pid', async (req, res) => {
	const { pid } = req.params;
	await prisma.project.delete({ where: { id: pid } });
	res.json({ ok: true });
});

// Add a column to a project
router.post('/projects/:pid/columns', async (req, res) => {
	const { pid } = req.params;
	const { title, order } = req.body;
	const column = await prisma.column.create({
		data: { projectId: pid, title, order },
	});
	res.json({ ok: true, column });
});

// Update a column
router.patch('/columns/:cid', async (req, res) => {
	const { cid } = req.params;
	const { title, order } = req.body;
	const column = await prisma.column.update({
		where: { id: cid },
		data: { title, order },
	});
	res.json({ ok: true, column });
});

// Add a task to a project
router.post('/projects/:pid/tasks', async (req, res) => {
	const { pid } = req.params;
	const { title, description, assigneeId, statusColId, dueAt, labels, order } = req.body;
	const task = await prisma.task.create({
		data: { projectId: pid, title, description, assigneeId, statusColId, dueAt, labels, order },
	});
	res.json({ ok: true, task });
});

// Update a task (move, assign, etc.)
router.patch('/tasks/:tid', async (req, res) => {
	const { tid } = req.params;
	const { title, description, assigneeId, statusColId, dueAt, labels, order } = req.body;
	const task = await prisma.task.update({
		where: { id: tid },
		data: { title, description, assigneeId, statusColId, dueAt, labels, order },
	});
	res.json({ ok: true, task });
});

// Add a comment to a task
router.post('/tasks/:tid/comments', async (req, res) => {
	const { tid } = req.params;
	const { authorId, body } = req.body;
	const comment = await prisma.comment.create({
		data: { taskId: tid, authorId, body },
	});
	res.json({ ok: true, comment });
});

export default router;
