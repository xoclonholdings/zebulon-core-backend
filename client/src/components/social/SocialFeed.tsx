import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Instagram, 
  Twitter, 
  Camera, 
  ShoppingBag,
  Heart,
  MessageCircle,
  Share,
  Eye,
  ExternalLink,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { SocialFeed, SocialPost } from "@shared/social-schema";

const platformIcons = {
  instagram: Instagram,
  x: Twitter,
  snapchat: Camera,
  flip: ShoppingBag,
};

const platformColors = {
  instagram: "from-pink-500 to-purple-600",
  x: "from-blue-400 to-blue-600",
  snapchat: "from-yellow-400 to-yellow-600",
  flip: "from-green-400 to-green-600",
};

export default function SocialFeed() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const { data: feeds = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/social/feeds"],
    queryFn: async () => {
      const response = await apiRequest("/api/social/feeds");
      return response as SocialFeed[];
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const { data: selectedFeed, isLoading: isLoadingSelected } = useQuery({
    queryKey: ["/api/social/feeds", selectedPlatform],
    queryFn: async () => {
      const response = await apiRequest(`/api/social/feeds/${selectedPlatform}`);
      return response as SocialFeed;
    },
    enabled: !!selectedPlatform,
  });

  const formatMetric = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffInHours = (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const SocialPostCard = ({ post }: { post: SocialPost }) => {
    const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons];
    const platformColor = platformColors[post.platform as keyof typeof platformColors];

    return (
      <Card className="zed-message p-6 mb-4 hover:zed-glow transition-all duration-300">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${platformColor} rounded-2xl flex items-center justify-center`}>
              <PlatformIcon className="text-white" size={18} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-foreground">{post.author.displayName}</span>
                {post.author.verified && (
                  <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-300">
                    <Sparkles size={8} className="mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">@{post.author.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground text-sm">
            <span>{formatTime(post.createdAt)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
              onClick={() => window.open(post.url, '_blank')}
            >
              <ExternalLink size={14} />
            </Button>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-foreground leading-relaxed">{post.content}</p>
          
          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.hashtags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs border-cyan-500/30 text-cyan-300">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Media */}
        {post.media.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-1 gap-2">
              {post.media.map((media: any, index: number) => (
                <div key={index} className="relative rounded-xl overflow-hidden">
                  {media.type === "image" ? (
                    <img
                      src={media.url}
                      alt="Post media"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  ) : (
                    <video
                      src={media.url}
                      poster={media.thumbnail}
                      controls
                      className="w-full h-auto max-h-96"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post Metrics */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Heart size={16} />
              <span className="text-sm">{formatMetric(post.metrics.likes)}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MessageCircle size={16} />
              <span className="text-sm">{formatMetric(post.metrics.comments)}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Share size={16} />
              <span className="text-sm">{formatMetric(post.metrics.shares)}</span>
            </div>
            {post.metrics.views && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Eye size={16} />
                <span className="text-sm">{formatMetric(post.metrics.views)}</span>
              </div>
            )}
          </div>
          
          <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300 capitalize">
            {post.platform === 'x' ? 'X' : post.platform}
          </Badge>
        </div>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 zed-avatar rounded-2xl flex items-center justify-center mx-auto mb-4">
          <RefreshCw size={24} className="text-white animate-spin" />
        </div>
        <p className="text-muted-foreground">Loading social feeds...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10 zed-glass">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Social Feeds
            </h2>
            <p className="text-sm text-muted-foreground">Live updates from your social platforms</p>
          </div>
          
          <Button
            onClick={() => refetch()}
            variant="ghost"
            size="sm"
            className="zed-button rounded-xl"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={selectedPlatform || "all"} onValueChange={(value) => setSelectedPlatform(value === "all" ? null : value)} className="h-full flex flex-col">
          <TabsList className="mx-6 mt-4 zed-glass">
            <TabsTrigger value="all" className="data-[state=active]:zed-gradient">
              All Feeds
            </TabsTrigger>
            {feeds.map((feed: SocialFeed) => {
              const PlatformIcon = platformIcons[feed.platform as keyof typeof platformIcons];
              return (
                <TabsTrigger
                  key={feed.platform}
                  value={feed.platform}
                  className="data-[state=active]:zed-gradient flex items-center space-x-2"
                >
                  <PlatformIcon size={16} />
                  <span className="capitalize">{feed.platform === 'x' ? 'X' : feed.platform}</span>
                  <Badge variant="outline" className="text-xs ml-2">
                    {feed.posts.length}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="all" className="p-6 space-y-0 mt-0">
              {feeds.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 zed-avatar rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Camera size={24} className="text-white" />
                  </div>
                  <p className="text-muted-foreground mb-2">No social feeds connected</p>
                  <p className="text-xs text-muted-foreground/60">Configure API keys to see your social media posts</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feeds
                    .flatMap((feed: SocialFeed) => feed.posts.map((post: SocialPost) => ({ ...post, feedPlatform: feed.platform })))
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((post: SocialPost) => (
                      <SocialPostCard key={`${post.platform}-${post.id}`} post={post} />
                    ))}
                </div>
              )}
            </TabsContent>
            
            {feeds.map((feed: SocialFeed) => (
              <TabsContent key={feed.platform} value={feed.platform} className="p-6 space-y-0 mt-0">
                {isLoadingSelected ? (
                  <div className="text-center py-12">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading {feed.platform} feed...</p>
                  </div>
                ) : !selectedFeed || selectedFeed.posts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 zed-avatar rounded-2xl flex items-center justify-center mx-auto mb-4">
                      {(() => {
                        const Icon = platformIcons[feed.platform as keyof typeof platformIcons];
                        return Icon ? <Icon size={24} className="text-white" /> : null;
                      })()}
                    </div>
                    <p className="text-muted-foreground mb-2">No {feed.platform} posts found</p>
                    <p className="text-xs text-muted-foreground/60">Check your API configuration</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedFeed?.posts.map((post: SocialPost) => (
                      <SocialPostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}