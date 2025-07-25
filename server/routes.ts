import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { upload, processFile, cleanupFile } from "./services/fileProcessor";
import { generateChatResponse, streamChatResponse } from "./services/openai";
import { setupLocalAuth, isAuthenticated } from "./localAuth";
import { insertConversationSchema, insertMessageSchema, insertFileSchema, insertSessionSchema, insertCoreMemorySchema, insertProjectMemorySchema, insertScratchpadMemorySchema } from "@shared/schema";
import { FlipShopService } from "./services/flipShop";
import { optimizationService } from "./services/optimizationService";
import { MemoryService } from "./services/memoryService";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth middleware
  await setupLocalAuth(app);

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

  // Flip.Shop Integration API Endpoints
  app.get("/api/flipshop/products", isAuthenticated, (req, res) => {
    try {
      const { search, category, priceMin, priceMax, rating, inStock, trending, brand } = req.query;
      
      const filters = {
        category: category as string,
        priceMin: priceMin ? parseFloat(priceMin as string) : undefined,
        priceMax: priceMax ? parseFloat(priceMax as string) : undefined,
        rating: rating ? parseFloat(rating as string) : undefined,
        inStock: inStock === 'true' ? true : inStock === 'false' ? false : undefined,
        trending: trending === 'true' ? true : trending === 'false' ? false : undefined,
        brand: brand as string,
      };

      const products = FlipShopService.searchProducts(search as string, filters);
      res.json(products);
    } catch (error) {
      console.error("FlipShop products error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/flipshop/products/:id", isAuthenticated, (req, res) => {
    try {
      const product = FlipShopService.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("FlipShop product error:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.get("/api/flipshop/categories", isAuthenticated, (req, res) => {
    try {
      const categories = FlipShopService.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("FlipShop categories error:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/flipshop/brands", isAuthenticated, (req, res) => {
    try {
      const brands = FlipShopService.getBrands();
      res.json(brands);
    } catch (error) {
      console.error("FlipShop brands error:", error);
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  app.get("/api/flipshop/trending", isAuthenticated, (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const products = FlipShopService.getTrendingProducts(limit);
      res.json(products);
    } catch (error) {
      console.error("FlipShop trending error:", error);
      res.status(500).json({ error: "Failed to fetch trending products" });
    }
  });

  app.post("/api/flipshop/cart/add", isAuthenticated, (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { productId } = req.body;
      
      const result = FlipShopService.addToCart(productId, userId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("FlipShop add to cart error:", error);
      res.status(500).json({ error: "Failed to add to cart" });
    }
  });

  app.post("/api/flipshop/wishlist/add", isAuthenticated, (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { productId } = req.body;
      
      const result = FlipShopService.addToWishlist(productId, userId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("FlipShop add to wishlist error:", error);
      res.status(500).json({ error: "Failed to add to wishlist" });
    }
  });

  app.get("/api/flipshop/recommendations/:productId", isAuthenticated, (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const recommendations = FlipShopService.getRecommendations(req.params.productId, limit);
      res.json(recommendations);
    } catch (error) {
      console.error("FlipShop recommendations error:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
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
