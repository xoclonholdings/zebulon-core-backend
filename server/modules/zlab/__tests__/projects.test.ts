

const request = require('supertest');
let app;
beforeAll(async () => {
  app = (await import(process.cwd() + '/server/app')).default;
});

export {};

describe('ZLab Projects API', () => {
  it('should get projects for a workspace', async () => {
    const res = await request(app).get('/api/zlab/projects?workspaceId=demo');
    expect(res.status).toBe(200);
    // Add more assertions as needed
  });
});
