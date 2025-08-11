// Zulu API client for frontend
export const ZuluAPI = {
  async brief() {
    const res = await fetch('/api/zulu/brief');
    if (!res.ok) throw new Error('Failed to fetch Zulu brief');
    return res.json();
  },
  async update() {
    const res = await fetch('/api/zulu/update', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to trigger update');
    return res.json();
  },
  sseUrl() {
    return '/api/zulu/_events/zulu';
  },
};
