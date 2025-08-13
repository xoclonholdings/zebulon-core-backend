// Shared ZED types for both frontend and backend

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
