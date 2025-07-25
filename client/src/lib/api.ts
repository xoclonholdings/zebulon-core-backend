import { apiRequest } from './queryClient';
import type { 
  Conversation, 
  InsertConversation, 
  Message, 
  InsertMessage,
  File,
  Session 
} from '@shared/schema';

// Conversations
export async function createConversation(data: Partial<InsertConversation>): Promise<Conversation> {
  const response = await apiRequest('POST', '/api/conversations', data);
  return response.json();
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await apiRequest('GET', '/api/conversations');
  return response.json();
}

export async function getConversation(id: string): Promise<Conversation> {
  const response = await apiRequest('GET', `/api/conversations/${id}`);
  return response.json();
}

export async function updateConversation(
  id: string, 
  updates: Partial<Conversation>
): Promise<Conversation> {
  const response = await apiRequest('PATCH', `/api/conversations/${id}`, updates);
  return response.json();
}

export async function deleteConversation(id: string): Promise<void> {
  await apiRequest('DELETE', `/api/conversations/${id}`);
}

// Messages
export async function getMessages(conversationId: string): Promise<Message[]> {
  const response = await apiRequest('GET', `/api/conversations/${conversationId}/messages`);
  return response.json();
}

export async function sendMessage(
  conversationId: string, 
  content: string
): Promise<{ userMessage: Message; aiMessage: Message }> {
  const response = await apiRequest('POST', `/api/conversations/${conversationId}/messages`, {
    content,
  });
  return response.json();
}

// Files
export async function getFiles(conversationId: string): Promise<File[]> {
  const response = await apiRequest('GET', `/api/conversations/${conversationId}/files`);
  return response.json();
}

export async function uploadFiles(
  conversationId: string, 
  files: FileList
): Promise<{ files: File[] }> {
  const formData = new FormData();
  Array.from(files).forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`/api/conversations/${conversationId}/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
}

// Session
export async function getSession(conversationId: string): Promise<Session> {
  const response = await apiRequest('GET', `/api/conversations/${conversationId}/session`);
  return response.json();
}

// Export
export async function exportConversation(conversationId: string): Promise<Blob> {
  const response = await fetch(`/api/conversations/${conversationId}/export`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Export failed: ${response.statusText}`);
  }

  return response.blob();
}
