import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

describe('ZLab Seed Data', () => {
  it('should have demo workspace and sample data', async () => {
    const ws = await prisma.workspace.findFirst({ where: { name: 'ZLab Sandbox' } });
    expect(ws).toBeTruthy();
    // Add more assertions for projects, tasks, meetings, notes, files
  });
});
