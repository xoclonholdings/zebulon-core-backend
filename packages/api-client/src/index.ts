export type TokenProvider = () => Promise<string> | string
export class Api {
  constructor(private base: string, private getToken?: TokenProvider) {}
  private async call<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = this.getToken ? await this.getToken() : undefined
    const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    const res = await fetch(`${this.base}${path}`, { ...init, headers })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    return res.json() as Promise<T>
  }
  get<T>(p: string) { return this.call<T>(p) }
  post<T>(p: string, body: any) { return this.call<T>(p, { method: 'POST', body: JSON.stringify(body) }) }
}
