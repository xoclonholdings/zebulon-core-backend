import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


async function main() {
  // Create demo users
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@zlab.local' },
    update: {},
    create: { email: 'alice@zlab.local', firstName: 'Alice', lastName: 'Zebulon' },
  });
  const user2 = await prisma.user.upsert({
    where: { email: 'bob@zlab.local' },
    update: {},
    create: { email: 'bob@zlab.local', firstName: 'Bob', lastName: 'Lab' },
  });

  // Create demo workspace
  // Workspace upsert must use unique field (id), so try findFirst or create
  let ws = await prisma.workspace.findFirst({ where: { name: 'ZLab Sandbox' } });
  if (!ws) {
    ws = await prisma.workspace.create({ data: { name: 'ZLab Sandbox' } });
  }

  // Add members
  await prisma.workspaceMember.createMany({
    data: [
      { workspaceId: ws.id, userId: user1.id, role: 'OWNER' },
      { workspaceId: ws.id, userId: user2.id, role: 'EDITOR' },
    ],
    skipDuplicates: true,
  });

  // Create projects
  const proj1 = await prisma.project.create({
    data: { workspaceId: ws.id, name: 'Project Alpha', description: 'First demo project' },
  });
  const proj2 = await prisma.project.create({
    data: { workspaceId: ws.id, name: 'Project Beta', description: 'Second demo project' },
  });

  // Kanban columns
  const [colBacklog, colTodo, colDoing, colDone] = await Promise.all([
    prisma.column.create({ data: { projectId: proj1.id, title: 'Backlog', order: 0 } }),
    prisma.column.create({ data: { projectId: proj1.id, title: 'Todo', order: 1 } }),
    prisma.column.create({ data: { projectId: proj1.id, title: 'Doing', order: 2 } }),
    prisma.column.create({ data: { projectId: proj1.id, title: 'Done', order: 3 } }),
  ]);

  // Tasks
  await prisma.task.createMany({
    data: [
      { projectId: proj1.id, title: 'Design UI', statusColId: colBacklog.id, order: 0 },
      { projectId: proj1.id, title: 'Set up DB', statusColId: colTodo.id, order: 1 },
      { projectId: proj1.id, title: 'Implement API', statusColId: colDoing.id, order: 2 },
      { projectId: proj1.id, title: 'Write tests', statusColId: colDone.id, order: 3 },
      { projectId: proj2.id, title: 'Kickoff meeting', order: 0 },
    ],
  });

  // Meetings
  await prisma.meeting.createMany({
    data: [
      { workspaceId: ws.id, title: 'Sprint Planning', roomCode: 'SPRINT1' },
      { workspaceId: ws.id, title: 'Demo Day', roomCode: 'DEMO1' },
    ],
  });

  // Notes
  await prisma.notePage.createMany({
    data: [
      { workspaceId: ws.id, title: 'Welcome', slug: 'welcome', snapshot: '# Welcome to ZLab\nThis is your sandbox.' },
      { workspaceId: ws.id, title: 'How to Use', slug: 'how-to-use', snapshot: '## Usage\nTry the tabs above.' },
      { workspaceId: ws.id, title: 'Meeting Notes', slug: 'meeting-notes', snapshot: '### Meeting notes go here.' },
    ],
  });

  // Folders and files
  const folderDocs = await prisma.folder.create({ data: { workspaceId: ws.id, name: 'Docs' } });
  const folderMedia = await prisma.folder.create({ data: { workspaceId: ws.id, name: 'Media' } });
  await prisma.file.createMany({
    data: [
      { workspaceId: ws.id, folderId: folderDocs.id, fileName: 'README.md', mimeType: 'text/markdown', size: 128 },
      { workspaceId: ws.id, folderId: folderMedia.id, fileName: 'logo.png', mimeType: 'image/png', size: 2048 },
      { workspaceId: ws.id, folderId: folderMedia.id, fileName: 'intro.mp4', mimeType: 'video/mp4', size: 10240 },
      { workspaceId: ws.id, folderId: folderDocs.id, fileName: 'spec.pdf', mimeType: 'application/pdf', size: 4096 },
    ],
  });

  console.log('Seeded demo workspace:', ws.name);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
