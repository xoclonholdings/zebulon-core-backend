import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { upload, processFile, cleanupFile } from "./services/fileProcessor";
import { generateChatResponse, streamChatResponse } from "./services/openai";
import { setupLocalAuth, isAuthenticated } from "./localAuth";
import { prismaAuth, prismaLogin, getCurrentUser } from "./prismaAuth";
import { PrismaChatService } from "./prismaChatService";
import { QueryLogger } from "./services/queryLogger";
import { insertConversationSchema, insertMessageSchema, insertFileSchema, insertSessionSchema, insertCoreMemorySchema, insertProjectMemorySchema, insertScratchpadMemorySchema } from "@shared/schema";

import { optimizationService } from "./services/optimizationService";
import { MemoryService } from "./services/memoryService";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth middleware
  await setupLocalAuth(app);

  // Add Prisma authentication routes
  app.post("/api/prisma/login", prismaLogin);
  app.get("/api/prisma/user", prismaAuth, getCurrentUser);
  app.get("/api/prisma/conversations", prismaAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await PrismaChatService.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // ========================================
  // QUERY LOGGING CRUD API ROUTES
  // ========================================

  // CREATE: Log a new query interaction
  app.post("/api/query-logs", prismaAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { query, response, conversationId, model, duration, metadata } = req.body;

      if (!query || !response) {
        return res.status(400).json({ error: "Query and response are required" });
      }

      const logEntry = await QueryLogger.logQuery({
        userId,
        query,
        response,
        conversationId,
        model,
        duration,
        metadata
      });

      res.status(201).json({
        success: true,
        logId: logEntry.id,
        message: "Query interaction logged successfully"
      });
    } catch (error) {
      console.error("Error logging query:", error);
      res.status(500).json({ error: "Failed to log query interaction" });
    }
  });

  // READ: Get query logs with filtering
  app.get("/api/query-logs", prismaAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const {
        conversationId,
        dateFrom,
        dateTo,
        model,
        limit = 50,
        offset = 0,
        includeAll = false
      } = req.query;

      const filters: any = {
        limit: parseInt(limit),
        offset: parseInt(offset)
      };

      // Admin users can see all logs, regular users only their own
      if (!includeAll) {
        filters.userId = userId;
      }

      if (conversationId) filters.conversationId = conversationId;
      if (model) filters.model = model;
      if (dateFrom) filters.dateFrom = new Date(dateFrom);
      if (dateTo) filters.dateTo = new Date(dateTo);

      const logs = await QueryLogger.getQueryLogs(filters);

      res.json({
        logs,
        total: logs.length,
        filters: filters
      });
    } catch (error) {
      console.error("Error fetching query logs:", error);
      res.status(500).json({ error: "Failed to fetch query logs" });
    }
  });

  // READ: Get user query statistics
  app.get("/api/query-logs/stats", prismaAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { days = 30, targetUserId } = req.query;

      // Allow checking stats for other users (admin feature)
      const statsUserId = targetUserId || userId;
      
      const stats = await QueryLogger.getUserQueryStats(statsUserId, parseInt(days));

      res.json({
        userId: statsUserId,
        stats
      });
    } catch (error) {
      console.error("Error fetching query stats:", error);
      res.status(500).json({ error: "Failed to fetch query statistics" });
    }
  });

  // READ: Get top/recent queries
  app.get("/api/query-logs/top", prismaAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { limit = 10, includeAll = false } = req.query;

      const targetUserId = includeAll ? undefined : userId;
      const topQueries = await QueryLogger.getTopQueries(targetUserId, parseInt(limit));

      res.json({
        queries: topQueries,
        limit: parseInt(limit)
      });
    } catch (error) {
      console.error("Error fetching top queries:", error);
      res.status(500).json({ error: "Failed to fetch top queries" });
    }
  });

  // READ: Search queries by content
  app.get("/api/query-logs/search", prismaAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { q: searchTerm, limit = 20, includeAll = false } = req.query;

      if (!searchTerm) {
        return res.status(400).json({ error: "Search term (q) is required" });
      }

      const targetUserId = includeAll ? undefined : userId;
      const results = await QueryLogger.searchQueries(searchTerm, targetUserId, parseInt(limit));

      res.json({
        results,
        searchTerm,
        count: results.length
      });
    } catch (error) {
      console.error("Error searching queries:", error);
      res.status(500).json({ error: "Failed to search queries" });
    }
  });

  // DELETE: Cleanup old query logs (admin only)
  app.delete("/api/query-logs/cleanup", prismaAuth, async (req: any, res) => {
    try {
      const { daysToKeep = 90 } = req.body;

      const deletedCount = await QueryLogger.cleanupOldLogs(parseInt(daysToKeep));

      res.json({
        success: true,
        deletedCount,
        message: `Cleaned up ${deletedCount} old query logs`
      });
    } catch (error) {
      console.error("Error cleaning up query logs:", error);
      res.status(500).json({ error: "Failed to cleanup query logs" });
    }
  });

  // UPDATE: Batch operations for query logs
  app.patch("/api/query-logs/batch", prismaAuth, async (req: any, res) => {
    try {
      const { action, logIds, metadata } = req.body;

      if (!action || !logIds || !Array.isArray(logIds)) {
        return res.status(400).json({ error: "Action and logIds array are required" });
      }

      switch (action) {
        case 'update_metadata':
          const { prisma } = await import("../prismaAuth");
          const updated = await prisma.analytics.updateMany({
            where: {
              id: { in: logIds },
              event_type: 'query_interaction'
            },
            data: {
              metadata: {
                ...metadata,
                updated_at: new Date().toISOString()
              }
            }
          });

          res.json({
            success: true,
            updatedCount: updated.count,
            action
          });
          break;

        case 'delete':
          const deleted = await prisma.analytics.deleteMany({
            where: {
              id: { in: logIds },
              event_type: 'query_interaction'
            }
          });

          res.json({
            success: true,
            deletedCount: deleted.count,
            action
          });
          break;

        default:
          res.status(400).json({ error: "Invalid action. Use 'update_metadata' or 'delete'" });
      }
    } catch (error) {
      console.error("Error performing batch operation:", error);
      res.status(500).json({ error: "Failed to perform batch operation" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Upload profile picture
  app.post('/api/auth/profile-picture', isAuthenticated, upload.single('profilePicture'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Generate a profile picture URL (in a real app, you'd upload to cloud storage)
      const profileImageUrl = `/uploads/${file.filename}`;
      
      // Update user's profile picture
      const updatedUser = await storage.updateUser(userId, { profileImageUrl });
      
      res.json({ 
        success: true, 
        profileImageUrl,
        user: updatedUser 
      });
    } catch (error) {
      console.error("Profile picture upload error:", error);
      res.status(500).json({ error: "Failed to upload profile picture" });
    }
  });
  
  // Get conversations for authenticated user
  app.get("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversationsByUser(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversationData = insertConversationSchema.parse({
        userId,
        title: req.body.title || "New Analysis",
        model: req.body.model || "gpt-4o",
        isActive: true
      });

      const conversation = await storage.createConversation(conversationData);
      
      // Create session for the conversation
      const sessionData = insertSessionSchema.parse({
        conversationId: conversation.id,
        userId
      });
      await storage.createSession(sessionData);

      res.json(conversation);
    } catch (error) {
      res.status(400).json({ error: "Failed to create conversation" });
    }
  });

  // Get conversation by ID
  app.get("/api/conversations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      // Verify user owns this conversation
      if (conversation.userId !== req.user.claims.sub) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Update conversation
  app.patch("/api/conversations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const updates = req.body;
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      // Verify user owns this conversation
      if (conversation.userId !== req.user.claims.sub) {
        return res.status(403).json({ error: "Access denied" });
      }
      const updatedConversation = await storage.updateConversation(req.params.id, updates);
      res.json(updatedConversation);
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
  app.get("/api/conversations/:id/messages", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getMessagesByConversation(req.params.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Send message and get AI response
  app.post("/api/conversations/:id/messages", isAuthenticated, async (req, res) => {
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

      // Get conversation to check mode
      const conversation = await storage.getConversation(conversationId);
      const conversationMode = (conversation?.mode as "chat" | "agent") || "chat";

      // Generate AI response
      const aiResponse = await generateChatResponse(chatHistory, conversationMode);

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
      const { content, mode = "chat" } = req.body;

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

      // Get conversation to check mode
      const conversation = await storage.getConversation(conversationId);
      const conversationMode = (conversation?.mode as "chat" | "agent") || mode;

      // Stream AI response
      for await (const chunk of streamChatResponse(chatHistory, conversationMode)) {
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
  app.post("/api/conversations/:id/upload", isAuthenticated, upload.array('files'), async (req, res) => {
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

  // Memory API routes
  
  // Core Memory routes (admin only)
  app.get("/api/memory/core", isAuthenticated, async (req: any, res) => {
    try {
      const memories = await MemoryService.getAllCoreMemory();
      res.json(memories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch core memory" });
    }
  });

  app.post("/api/memory/core", isAuthenticated, async (req: any, res) => {
    try {
      // Only allow Admin user to modify core memory
      const sessionUser = (req.session as any)?.user;
      const username = sessionUser?.username;
      
      if (username !== 'Admin') {
        return res.status(403).json({ error: "Only Admin user can modify core memory" });
      }
      
      const memoryData = insertCoreMemorySchema.parse(req.body);
      const memory = await MemoryService.setCoreMemory(memoryData);
      res.json(memory);
    } catch (error) {
      res.status(500).json({ error: "Failed to set core memory" });
    }
  });

  // Project Memory routes
  app.get("/api/memory/project", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const memories = await MemoryService.getProjectMemory(userId);
      res.json(memories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project memory" });
    }
  });

  app.post("/api/memory/project", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const memoryData = insertProjectMemorySchema.parse({
        ...req.body,
        userId
      });
      const memory = await MemoryService.createProjectMemory(memoryData);
      res.json(memory);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project memory" });
    }
  });

  app.put("/api/memory/project/:id", isAuthenticated, async (req: any, res) => {
    try {
      const memory = await MemoryService.updateProjectMemory(req.params.id, req.body);
      res.json(memory);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project memory" });
    }
  });

  app.delete("/api/memory/project/:id", isAuthenticated, async (req: any, res) => {
    try {
      const success = await MemoryService.deleteProjectMemory(req.params.id);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project memory" });
    }
  });

  // Scratchpad Memory routes
  app.get("/api/memory/scratchpad", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const memories = await MemoryService.getScratchpadMemory(userId);
      res.json(memories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scratchpad memory" });
    }
  });

  app.post("/api/memory/scratchpad", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const memoryData = insertScratchpadMemorySchema.parse({
        ...req.body,
        userId
      });
      const memory = await MemoryService.createScratchpadMemory(memoryData);
      res.json(memory);
    } catch (error) {
      res.status(500).json({ error: "Failed to create scratchpad memory" });
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

  // User Management API Endpoints (Admin only)
  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      // Only allow Admin user to manage users
      const sessionUser = (req.session as any)?.user;
      const username = sessionUser?.username;
      
      if (username !== 'Admin') {
        return res.status(403).json({ error: "Only Admin user can manage users" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      // Only allow Admin user to create users
      const sessionUser = (req.session as any)?.user;
      const username = sessionUser?.username;
      
      if (username !== 'Admin') {
        return res.status(403).json({ error: "Only Admin user can create users" });
      }
      
      const { username: newUsername, password, email, firstName, lastName } = req.body;
      
      if (!newUsername || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(newUsername);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
      }
      
      const userData = {
        id: `user_${Date.now()}`,
        username: newUsername,
        password,
        email: email || `${newUsername}@zed.local`,
        firstName: firstName || newUsername,
        lastName: lastName || "User",
        profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + newUsername
      };
      
      const user = await storage.createUser(userData);
      res.json({ success: true, user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/admin/users/:id", isAuthenticated, async (req: any, res) => {
    try {
      // Only allow Admin user to update users
      const sessionUser = (req.session as any)?.user;
      const username = sessionUser?.username;
      
      if (username !== 'Admin') {
        return res.status(403).json({ error: "Only Admin user can update users" });
      }
      
      const { username: newUsername, password, email, firstName, lastName, isActive } = req.body;
      const userId = req.params.id;
      
      const user = await storage.updateUser(userId, {
        username: newUsername,
        password,
        email,
        firstName,
        lastName,
        isActive
      });
      
      res.json({ success: true, user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", isAuthenticated, async (req: any, res) => {
    try {
      // Only allow Admin user to delete users
      const sessionUser = (req.session as any)?.user;
      const username = sessionUser?.username;
      
      if (username !== 'Admin') {
        return res.status(403).json({ error: "Only Admin user can delete users" });
      }
      
      const userId = req.params.id;
      
      // Prevent admin from deleting themselves
      if (userId === sessionUser?.id) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      
      const success = await storage.deleteUser(userId);
      res.json({ success });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Storage optimization endpoints
  app.get("/api/admin/optimization/stats", isAuthenticated, (req, res) => {
    try {
      const stats = optimizationService.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Optimization stats error:", error);
      res.status(500).json({ error: "Failed to fetch optimization stats" });
    }
  });

  app.post("/api/admin/optimization/force", isAuthenticated, async (req, res) => {
    try {
      await optimizationService.forceOptimization();
      res.json({ success: true, message: "Optimization completed" });
    } catch (error) {
      console.error("Force optimization error:", error);
      res.status(500).json({ error: "Failed to run optimization" });
    }
  });

  app.get("/api/admin/cache/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = storage.getCacheStats();
      res.json(stats);
    } catch (error) {
      console.error("Cache stats error:", error);
      res.status(500).json({ error: "Failed to fetch cache stats" });
    }
  });

  // User activity and search endpoints
  app.get("/api/conversations/search", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const results = await storage.searchConversations(userId, query);
      res.json(results);
    } catch (error) {
      console.error("Search conversations error:", error);
      res.status(500).json({ error: "Failed to search conversations" });
    }
  });

  app.get("/api/user/activity", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const activity = await storage.getRecentActivity(userId, limit);
      res.json(activity);
    } catch (error) {
      console.error("User activity error:", error);
      res.status(500).json({ error: "Failed to fetch user activity" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
