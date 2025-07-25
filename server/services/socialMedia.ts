import type { SocialPost, SocialFeed, SocialConfig } from "@shared/social-schema";

export class SocialMediaService {
  private config: SocialConfig;

  constructor(config: SocialConfig) {
    this.config = config;
  }

  async getInstagramFeed(limit: number = 10): Promise<SocialFeed> {
    if (!this.config.instagram?.enabled || !this.config.instagram?.accessToken) {
      return {
        platform: "instagram",
        posts: [],
        lastUpdated: new Date(),
        hasMore: false,
      };
    }

    try {
      // Instagram Basic Display API
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username&access_token=${this.config.instagram.accessToken}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      const posts: SocialPost[] = data.data.map((item: any) => ({
        id: item.id,
        platform: "instagram" as const,
        content: item.caption || "",
        author: {
          username: item.username,
          displayName: item.username,
          verified: false,
        },
        media: item.media_url ? [{
          type: item.media_type === "VIDEO" ? "video" : "image",
          url: item.media_url,
          thumbnail: item.thumbnail_url,
        }] : [],
        metrics: {
          likes: 0,
          shares: 0,
          comments: 0,
        },
        createdAt: new Date(item.timestamp),
        url: item.permalink,
        hashtags: this.extractHashtags(item.caption || ""),
        mentions: this.extractMentions(item.caption || ""),
      }));

      return {
        platform: "instagram",
        posts,
        lastUpdated: new Date(),
        hasMore: data.paging?.next ? true : false,
        nextCursor: data.paging?.cursors?.after,
      };
    } catch (error) {
      console.error("Instagram feed error:", error);
      return {
        platform: "instagram",
        posts: [],
        lastUpdated: new Date(),
        hasMore: false,
      };
    }
  }

  async getXFeed(limit: number = 10): Promise<SocialFeed> {
    if (!this.config.x?.enabled || !this.config.x?.bearerToken) {
      return {
        platform: "x",
        posts: [],
        lastUpdated: new Date(),
        hasMore: false,
      };
    }

    try {
      // X API v2
      const response = await fetch(
        `https://api.twitter.com/2/tweets/search/recent?query=from:me&max_results=${limit}&tweet.fields=created_at,public_metrics,author_id&user.fields=username,name,profile_image_url,verified&expansions=author_id,attachments.media_keys&media.fields=type,url,preview_image_url`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.x.bearerToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`X API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      const posts: SocialPost[] = data.data?.map((tweet: any) => {
        const author = data.includes?.users?.find((user: any) => user.id === tweet.author_id);
        const media = data.includes?.media?.filter((m: any) => 
          tweet.attachments?.media_keys?.includes(m.media_key)
        ) || [];

        return {
          id: tweet.id,
          platform: "x" as const,
          content: tweet.text,
          author: {
            username: author?.username || "unknown",
            displayName: author?.name || "Unknown User",
            avatarUrl: author?.profile_image_url,
            verified: author?.verified || false,
          },
          media: media.map((m: any) => ({
            type: m.type === "video" ? "video" : "image",
            url: m.url,
            thumbnail: m.preview_image_url,
          })),
          metrics: {
            likes: tweet.public_metrics?.like_count || 0,
            shares: tweet.public_metrics?.retweet_count || 0,
            comments: tweet.public_metrics?.reply_count || 0,
            views: tweet.public_metrics?.impression_count,
          },
          createdAt: new Date(tweet.created_at),
          url: `https://x.com/${author?.username}/status/${tweet.id}`,
          hashtags: this.extractHashtags(tweet.text),
          mentions: this.extractMentions(tweet.text),
        };
      }) || [];

      return {
        platform: "x",
        posts,
        lastUpdated: new Date(),
        hasMore: data.meta?.next_token ? true : false,
        nextCursor: data.meta?.next_token,
      };
    } catch (error) {
      console.error("X feed error:", error);
      return {
        platform: "x",
        posts: [],
        lastUpdated: new Date(),
        hasMore: false,
      };
    }
  }

  async getSnapchatFeed(limit: number = 10): Promise<SocialFeed> {
    if (!this.config.snapchat?.enabled || !this.config.snapchat?.clientId) {
      return {
        platform: "snapchat",
        posts: [],
        lastUpdated: new Date(),
        hasMore: false,
      };
    }

    // Note: Snapchat's public API is limited. This is a placeholder for when they expand access.
    return {
      platform: "snapchat",
      posts: [],
      lastUpdated: new Date(),
      hasMore: false,
    };
  }

  async getFlipFeed(limit: number = 10): Promise<SocialFeed> {
    if (!this.config.flip?.enabled || !this.config.flip?.apiKey) {
      return {
        platform: "flip",
        posts: [],
        lastUpdated: new Date(),
        hasMore: false,
      };
    }

    try {
      // Flip.shop API (hypothetical - actual API may differ)
      const response = await fetch(
        `https://api.flip.shop/v1/posts?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.flip.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Flip API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      const posts: SocialPost[] = data.posts?.map((post: any) => ({
        id: post.id,
        platform: "flip" as const,
        content: post.description || "",
        author: {
          username: post.author.username,
          displayName: post.author.displayName,
          avatarUrl: post.author.avatar,
          verified: post.author.verified || false,
        },
        media: post.media ? [{
          type: post.media.type,
          url: post.media.url,
          thumbnail: post.media.thumbnail,
        }] : [],
        metrics: {
          likes: post.likes || 0,
          shares: post.shares || 0,
          comments: post.comments || 0,
        },
        createdAt: new Date(post.createdAt),
        url: post.url,
        hashtags: this.extractHashtags(post.description || ""),
        mentions: this.extractMentions(post.description || ""),
      })) || [];

      return {
        platform: "flip",
        posts,
        lastUpdated: new Date(),
        hasMore: data.hasMore || false,
      };
    } catch (error) {
      console.error("Flip feed error:", error);
      return {
        platform: "flip",
        posts: [],
        lastUpdated: new Date(),
        hasMore: false,
      };
    }
  }

  async getAllFeeds(limit: number = 10): Promise<SocialFeed[]> {
    const feeds = await Promise.all([
      this.getInstagramFeed(limit),
      this.getXFeed(limit),
      this.getSnapchatFeed(limit),
      this.getFlipFeed(limit),
    ]);

    return feeds.filter(feed => feed.posts.length > 0);
  }

  private extractHashtags(text: string): string[] {
    const hashtags = text.match(/#[\w]+/g);
    return hashtags ? hashtags.map(tag => tag.substring(1)) : [];
  }

  private extractMentions(text: string): string[] {
    const mentions = text.match(/@[\w]+/g);
    return mentions ? mentions.map(mention => mention.substring(1)) : [];
  }
}

// Initialize with environment variables
export const socialMediaService = new SocialMediaService({
  instagram: {
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
    enabled: !!process.env.INSTAGRAM_ACCESS_TOKEN,
  },
  x: {
    bearerToken: process.env.X_BEARER_TOKEN,
    enabled: !!process.env.X_BEARER_TOKEN,
  },
  snapchat: {
    clientId: process.env.SNAPCHAT_CLIENT_ID,
    clientSecret: process.env.SNAPCHAT_CLIENT_SECRET,
    enabled: !!(process.env.SNAPCHAT_CLIENT_ID && process.env.SNAPCHAT_CLIENT_SECRET),
  },
  flip: {
    apiKey: process.env.FLIP_API_KEY,
    enabled: !!process.env.FLIP_API_KEY,
  },
});