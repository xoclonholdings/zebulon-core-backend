import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('PrismaClient keys:', Object.keys(prisma));

(async () => {
  try {
    // Try to access both lowercase and capitalized model properties
    console.log('workspace:', typeof prisma.workspace);
    console.log('Workspace:', typeof prisma.Workspace);
    console.log('project:', typeof prisma.project);
    console.log('Project:', typeof prisma.Project);
    console.log('task:', typeof prisma.task);
    console.log('Task:', typeof prisma.Task);
    console.log('meeting:', typeof prisma.meeting);
    console.log('Meeting:', typeof prisma.Meeting);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
})();
