

const request = require('supertest');
let app;
beforeAll(async () => {
  app = (await import('../../server/app')).default;
});

export {};

describe('ZED Tile E2E', () => {
  it('/api/zed/status should return ok', async () => {
    const res = await request(app).get('/api/zed/status');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
  // TODO: settings GET/PUT, action POST, event bus check
});
