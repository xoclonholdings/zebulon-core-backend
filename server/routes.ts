import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { upload, processFile, cleanupFile } from "./services/fileProcessor.js";
import { generateChatResponse, streamChatResponse } from "./services/openai.js";
import { insertConversationSchema, insertMessageSchema, insertFileSchema, insertSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get conversations for user
  app.get("/api/conversations", async (req, res) => {
    try {
      // For demo purposes, using a default user ID
      const userId = "demo-user";
      const conversations = await storage.getConversationsByUser(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const conversationData = insertConversationSchema.parse({
        userId: "demo-user", // Default user for demo
        title: req.body.title || "New Analysis",
        model: req.body.model || "gpt-4o",
        isActive: true
      });

      const conversation = await storage.createConversation(conversationData);
      
      // Create session for the conversation
      const sessionData = insertSessionSchema.parse({
        conversationId: conversation.id,
        userId: "demo-user"
      });
      await storage.createSession(sessionData);

      res.json(conversation);
    } catch (error) {
      res.status(400).json({ error: "Failed to create conversation" });
    }
  });

  // Get conversation by ID
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Update conversation
  app.patch("/api/conversations/:id", async (req, res) => {
    try {
      const updates = req.body;
      const conversation = await storage.updateConversation(req.params.id, updates);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ error: "Failed to update conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      const success = await storage.deleteConversation(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Get messages for conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const messages = await storage.getMessagesByConversation(req.params.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Send message and get AI response
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = req.params.id;
      const { content, role = "user" } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Message content is required" });
      }

      // Save user message
      const userMessageData = insertMessageSchema.parse({
        conversationId,
        role,
        content
      });
      
      const userMessage = await storage.createMessage(userMessageData);

      // Get conversation history for context
      const messages = await storage.getMessagesByConversation(conversationId);
      const chatHistory = messages.map(msg => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content
      }));

      // Generate AI response
      const aiResponse = await generateChatResponse(chatHistory);

      // Save AI response
      const aiMessageData = insertMessageSchema.parse({
        conversationId,
        role: "assistant",
        content: aiResponse
      });
      
      const aiMessage = await storage.createMessage(aiMessageData);

      // Update conversation title if it's the first exchange
      if (messages.length <= 2) {
        const title = content.slice(0, 50) + (content.length > 50 ? "..." : "");
        await storage.updateConversation(conversationId, { 
          title,
          preview: aiResponse.slice(0, 100) + (aiResponse.length > 100 ? "..." : "")
        });
      }

      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Message error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  // Stream AI response
  app.post("/api/conversations/:id/stream", async (req, res) => {
    try {
      const conversationId = req.params.id;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Message content is required" });
      }

      // Set headers for SSE
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });

      // Save user message
      const userMessageData = insertMessageSchema.parse({
        conversationId,
        role: "user",
        content
      });
      
      await storage.createMessage(userMessageData);

      // Get conversation history
      const messages = await storage.getMessagesByConversation(conversationId);
      const chatHistory = messages.map(msg => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content
      }));

      let fullResponse = "";

      // Stream AI response
      for await (const chunk of streamChatResponse(chatHistory)) {
        fullResponse += chunk.content;
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        
        if (chunk.done) {
          // Save complete AI response
          const aiMessageData = insertMessageSchema.parse({
            conversationId,
            role: "assistant",
            content: fullResponse
          });
          
          await storage.createMessage(aiMessageData);
          break;
        }
      }

      res.end();
    } catch (error) {
      console.error("Streaming error:", error);
      res.write(`data: ${JSON.stringify({ error: "Failed to process message", done: true })}\n\n`);
      res.end();
    }
  });

  // Upload and process files
  app.post("/api/conversations/:id/upload", upload.array('files'), async (req, res) => {
    try {
      const conversationId = req.params.id;
      const files = req.files as any[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const processedFiles = [];

      for (const file of files) {
        try {
          // Process the file
          const processed = await processFile(file.path, file.mimetype);
          
          // Save file record to storage
          const fileData = insertFileSchema.parse({
            conversationId,
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            status: processed.error ? "error" : "completed",
            extractedContent: processed.extractedContent,
            analysis: processed.analysis
          });

          const savedFile = await storage.createFile(fileData);
          processedFiles.push(savedFile);

          // Clean up uploaded file
          await cleanupFile(file.path);
        } catch (error) {
          console.error(`Error processing file ${file.originalname}:`, error);
          
          // Save error record
          const fileData = insertFileSchema.parse({
            conversationId,
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            status: "error"
          });

          const savedFile = await storage.createFile(fileData);
          processedFiles.push(savedFile);

          await cleanupFile(file.path);
        }
      }

      res.json({ files: processedFiles });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to process uploaded files" });
    }
  });

  // Get files for conversation
  app.get("/api/conversations/:id/files", async (req, res) => {
    try {
      const files = await storage.getFilesByConversation(req.params.id);
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch files" });
    }
  });

  // Get session info
  app.get("/api/conversations/:id/session", async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Export conversation
  app.get("/api/conversations/:id/export", async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      const messages = await storage.getMessagesByConversation(req.params.id);
      const files = await storage.getFilesByConversation(req.params.id);

      const exportData = {
        conversation,
        messages,
        files: files.map(f => ({
          ...f,
          extractedContent: undefined // Don't include large content in export
        })),
        exportedAt: new Date().toISOString()
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="conversation-${req.params.id}.json"`);
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ error: "Failed to export conversation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
