

// Stub implementation for getAI
export function getAI() {
	return {
		name: 'StubAI',
		chat: async (...args: any[]) => {
			const msg = args[0] ?? '';
			return { reply: `Echo: ${msg}` };
		},
		chatStream: async function* (...args: any[]) {
			const msg = args[0] ?? '';
			yield { reply: `Echo: ${msg}` };
		},
	};
// (removed extra bracket)
}
