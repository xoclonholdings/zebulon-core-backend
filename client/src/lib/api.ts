
export const API_BASE = (import.meta as any).env?.VITE_API_BASE || '/api';

export async function api(path: string, init?: RequestInit) {
	const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
	const res = await fetch(url, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers || {}),
		},
	});
	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
	}
	return res;
}
