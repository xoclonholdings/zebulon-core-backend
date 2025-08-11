// ZedClient: Handles API calls to Zed backend
export type ZedClientOpts = {
  baseUrl: string;
  tokenProvider: () => Promise<string>;
};

export class ZedClient {
  constructor(private opts: ZedClientOpts) {}

  async ask(prompt: string, context?: any) {
    const token = await this.opts.tokenProvider();
    const res = await fetch(`${this.opts.baseUrl}/api/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt, context }),
    });
    if (!res.ok) throw new Error('Zed API unavailable');
    return res.json();
  }

  async summarize(text: string) {
    const token = await this.opts.tokenProvider();
    const res = await fetch(`${this.opts.baseUrl}/api/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('Zed API unavailable');
    return res.json();
  }

  async suggestNextStep(ctx: any) {
    const token = await this.opts.tokenProvider();
    const res = await fetch(`${this.opts.baseUrl}/api/next-step`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ctx }),
    });
    if (!res.ok) throw new Error('Zed API unavailable');
    return res.json();
  }
}
