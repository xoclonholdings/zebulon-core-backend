import { storage } from "../storage";
import { 
  type InsertCoreMemory, 
  type InsertProjectMemory, 
  type InsertScratchpadMemory,
  type CoreMemory,
  type ProjectMemory,
  type ScratchpadMemory
} from "@shared/schema";

export class MemoryService {
  // Core Memory - Persistent system configuration
  static async getCoreMemory(key: string): Promise<CoreMemory | null> {
    return await storage.getCoreMemoryByKey(key);
  }

  static async setCoreMemory(data: InsertCoreMemory): Promise<CoreMemory> {
    return await storage.upsertCoreMemory(data);
  }

  static async getAllCoreMemory(): Promise<CoreMemory[]> {
    return await storage.getAllCoreMemory();
  }

  // Project Memory - Saved context and datasets
  static async getProjectMemory(userId: string): Promise<ProjectMemory[]> {
    return await storage.getProjectMemoryByUser(userId);
  }

  static async createProjectMemory(data: InsertProjectMemory): Promise<ProjectMemory> {
    return await storage.createProjectMemory(data);
  }

  static async updateProjectMemory(id: string, updates: Partial<InsertProjectMemory>): Promise<ProjectMemory> {
    return await storage.updateProjectMemory(id, updates);
  }

  static async deleteProjectMemory(id: string): Promise<boolean> {
    return await storage.deleteProjectMemory(id);
  }

  // Scratchpad Memory - Temporary working memory
  static async getScratchpadMemory(userId: string): Promise<ScratchpadMemory[]> {
    return await storage.getScratchpadMemoryByUser(userId);
  }

  static async createScratchpadMemory(data: InsertScratchpadMemory): Promise<ScratchpadMemory> {
    // Set expiration to 24 hours from creation
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    return await storage.createScratchpadMemory({
      ...data,
      expiresAt
    });
  }

  // Daily reset for scratchpad memory
  static async resetScratchpadMemory(): Promise<void> {
    await storage.cleanupExpiredScratchpadMemory();
  }

  // Initialize default core memory values
  static async initializeDefaultCoreMemory(): Promise<void> {
    const defaults = [
      {
        key: "system_personality",
        value: "You are ZED, an enhanced AI assistant with advanced document processing capabilities. You are helpful, professional, and thorough in your responses. You maintain context across conversations and can reference uploaded files and project memory.",
        description: "Core personality and behavior guidelines for ZED",
        adminOnly: true
      },
      {
        key: "response_style", 
        value: "concise_professional",
        description: "Response style preference (concise_professional, detailed_technical, conversational)",
        adminOnly: true
      },
      {
        key: "file_processing_priority",
        value: "accuracy_over_speed",
        description: "File processing approach priority",
        adminOnly: true
      },
      {
        key: "memory_retention_days",
        value: "1",
        description: "Number of days to retain scratchpad memory",
        adminOnly: true
      }
    ];

    for (const defaultMemory of defaults) {
      const existing = await this.getCoreMemory(defaultMemory.key);
      if (!existing) {
        await this.setCoreMemory(defaultMemory);
      }
    }
  }
}