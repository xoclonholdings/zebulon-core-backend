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

// Helper for admin check
function isAdminUser(sessionUser: any) {
  return sessionUser?.username === 'Admin' || sessionUser?.email === 'admin@zed.local';
}

export async function registerRoutes(app: Express): Promise<Server> {
  await setupLocalAuth(app);

  // POST: Log user interaction with ZED
  app.post("/api/log", isAuthenticated, async (req: any, res: any) => {
    try {
      const userId = req.session.user?.id;
      const { prompt, response, metadata } = req.body;

      if (!prompt || !response) {
        return res.status(400).json({ error: "Both prompt and response are required" });
      }
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      try {
        const logEntry = await prisma.interaction_log.create({
          data: {
            user_id: userId,
            prompt: prompt.toString(),
            response: response.toString(),
            metadata: metadata || {},
            timestamp: new Date()
          }
        });

        res.status(201).json({
          success: true,
          logId: logEntry.id,
          timestamp: logEntry.timestamp,
          message: "Interaction logged successfully"
        });

      } finally {
        await prisma.$disconnect();
      }

    } catch (error) {
      res.status(500).json({ error: "Failed to log interaction" });
    }
  });

  // GET: Fetch interaction history for specific user
  app.get("/api/logs/:userId", isAuthenticated, async (req: any, res: any) => {
    try {
      const requestedUserId = req.params.userId;
      const sessionUserId = req.session.user?.id;
      const { limit = 50, offset = 0, dateFrom, dateTo } = req.query;

      const sessionUser = req.session.user;
      if (!isAdminUser(sessionUser) && requestedUserId !== sessionUserId) {
        return res.status(403).json({ error: "Access denied. You can only view your own interaction logs" });
      }

      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      try {
        const whereClause: any = { user_id: requestedUserId };
        if (dateFrom || dateTo) {
          whereClause.timestamp = {};
          if (dateFrom) whereClause.timestamp.gte = new Date(dateFrom);
          if (dateTo) whereClause.timestamp.lte = new Date(dateTo);
        }

        const logs = await prisma.interaction_log.findMany({
          where: whereClause,
          orderBy: { timestamp: 'desc' },
          take: parseInt(limit as string),
          skip: parseInt(offset as string),
          include: {
            users: {
              select: { email: true, firstName: true, lastName: true }
            }
          }
        });

        const totalCount = await prisma.interaction_log.count({ where: whereClause });

        const formattedLogs = logs.map(log => ({
          id: log.id,
          prompt: log.prompt,
          response: log.response,
          timestamp: log.timestamp,
          metadata: log.metadata,
          user: {
            email: log.users?.email,
            name: `${log.users?.firstName || ''} ${log.users?.lastName || ''}`.trim()
          }
        }));

        res.json({
          success: true,
          userId: requestedUserId,
          logs: formattedLogs,
          pagination: {
            total: totalCount,
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
            hasMore: (parseInt(offset as string) + parseInt(limit as string)) < totalCount
          },
          filters: { dateFrom, dateTo }
        });

      } finally {
        await prisma.$disconnect();
      }

    } catch (error) {
      res.status(500).json({ error: "Failed to fetch interaction logs" });
    }
  });

  // GET: Get interaction statistics for user (admin dashboard)
  app.get("/api/logs/:userId/stats", isAuthenticated, async (req: any, res: any) => {
    try {
      const requestedUserId = req.params.userId;
      const sessionUserId = req.session.user?.id;
      const { days = 30 } = req.query;

      const sessionUser = req.session.user;
      if (!isAdminUser(sessionUser) && requestedUserId !== sessionUserId) {
        return res.status(403).json({ error: "Access denied. You can only view your own statistics" });
      }

      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      try {
        const since = new Date();
        since.setDate(since.getDate() - parseInt(days as string));

        const totalInteractions = await prisma.interaction_log.count({
          where: { user_id: requestedUserId, timestamp: { gte: since } }
        });

        const dailyStats = await prisma.$queryRaw`
          SELECT 
            DATE(timestamp) as date,
            COUNT(*) as interaction_count,
            AVG(LENGTH(prompt)) as avg_prompt_length,
            AVG(LENGTH(response)) as avg_response_length
          FROM interaction_log 
          WHERE user_id = ${requestedUserId}
            AND timestamp >= ${since}
          GROUP BY DATE(timestamp)
          ORDER BY date DESC
        `;

        const recentPrompts = await prisma.interaction_log.findMany({
          where: { user_id: requestedUserId, timestamp: { gte: since } },
          select: { prompt: true, timestamp: true },
          orderBy: { timestamp: 'desc' },
          take: 10
        });

        res.json({
          success: true,
          userId: requestedUserId,
          period_days: parseInt(days as string),
          statistics: {
            total_interactions: totalInteractions,
            daily_breakdown: dailyStats,
            recent_prompts: recentPrompts.map(p => ({
              prompt: p.prompt.substring(0, 100) + (p.prompt.length > 100 ? '...' : ''),
              timestamp: p.timestamp
            }))
          }
        });

      } finally {
        await prisma.$disconnect();
      }

    } catch (error) {
      res.status(500).json({ error: "Failed to fetch interaction statistics" });
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

      const userMessageData = insertMessageSchema.parse({ conversationId, role, content });
      const userMessage = await storage.createMessage(userMessageData);

      const messages = await storage.getMessagesByConversation(conversationId);
      const chatHistory = messages.map(msg => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content
      }));

      const conversation = await storage.getConversation(conversationId);
      const conversationMode = (conversation?.mode as "chat" | "agent") || "chat";

      try {
        const aiResponse = await generateChatResponse(chatHistory, conversationMode);

        const aiMessageData = insertMessageSchema.parse({
          conversationId,
          role: "assistant",
          content: aiResponse
        });

        const aiMessage = await storage.createMessage(aiMessageData);

        if (messages.length <= 2) {
          const title = content.slice(0, 50) + (content.length > 50 ? "..." : "");
          await storage.updateConversation(conversationId, {
            title,
            preview: aiResponse.slice(0, 100) + (aiResponse.length > 100 ? "..." : "")
          });
        }

        res.json({ userMessage, aiMessage });
      } catch (error) {
        res.status(500).json({ error: "AI response unavailable. Please try again later or contact support." });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  // POST: /api/ask - AI question answering endpoint
  app.post("/api/ask", isAuthenticated, async (req, res) => {
    try {
      const { prompt, model, stream } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }
      const answer = await generateChatResponse([{ role: "user", content: prompt }], model || "chat");
      res.json({ answer });
    } catch (error) {
      res.status(500).json({ error: "Failed to get AI answer" });
    }
  });

  // Middleware to handle 404 - Not Found
  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Middleware to handle errors
  app.use((err: any, req: any, res: any, next: any) => {
    res.status(500).json({ error: "Internal Server Error" });
  });

  const httpServer = createServer(app);
  return httpServer;
}