import { z } from "zod";

// Social Media Post Schema
export const socialPostSchema = z.object({
  id: z.string(),
  platform: z.enum(["instagram", "x", "snapchat", "flip"]),
  content: z.string(),
  author: z.object({
    username: z.string(),
    displayName: z.string(),
    avatarUrl: z.string().optional(),
    verified: z.boolean().default(false),
  }),
  media: z.array(z.object({
    type: z.enum(["image", "video", "gif"]),
    url: z.string(),
    thumbnail: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  })).default([]),
  metrics: z.object({
    likes: z.number().default(0),
    shares: z.number().default(0),
    comments: z.number().default(0),
    views: z.number().optional(),
  }),
  createdAt: z.date(),
  url: z.string(),
  hashtags: z.array(z.string()).default([]),
  mentions: z.array(z.string()).default([]),
});

export const socialFeedSchema = z.object({
  platform: z.enum(["instagram", "x", "snapchat", "flip"]),
  posts: z.array(socialPostSchema),
  lastUpdated: z.date(),
  hasMore: z.boolean().default(true),
  nextCursor: z.string().optional(),
});

export type SocialPost = z.infer<typeof socialPostSchema>;
export type SocialFeed = z.infer<typeof socialFeedSchema>;

// Social Media API Configuration
export const socialConfigSchema = z.object({
  instagram: z.object({
    accessToken: z.string().optional(),
    enabled: z.boolean().default(false),
  }).optional(),
  x: z.object({
    bearerToken: z.string().optional(),
    enabled: z.boolean().default(false),
  }).optional(),
  snapchat: z.object({
    clientId: z.string().optional(),
    clientSecret: z.string().optional(),
    enabled: z.boolean().default(false),
  }).optional(),
  flip: z.object({
    apiKey: z.string().optional(),
    enabled: z.boolean().default(false),
  }).optional(),
});

export type SocialConfig = z.infer<typeof socialConfigSchema>;