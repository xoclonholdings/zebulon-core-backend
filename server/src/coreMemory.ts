// Persistent memory for logged-in users (use DB for production)
const persistentMemory: Record<string, { role: 'user' | 'assistant', message: string }[]> = {};

export function getUserMemory(userId: string) {
	return persistentMemory[userId] || [];
}

export function appendUserMemory(userId: string, role: 'user' | 'assistant', message: string) {
	if (!persistentMemory[userId]) persistentMemory[userId] = [];
	persistentMemory[userId].push({ role, message });
	if (persistentMemory[userId].length > 100) persistentMemory[userId].shift();
}
