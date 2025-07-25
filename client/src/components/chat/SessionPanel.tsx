import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  FileText, 
  Code, 
  Share2, 
  ExternalLink,
  Clock,
  HardDrive,
  MessageSquare,
  File
} from "lucide-react";
import type { Conversation, File as FileType, Session } from "@shared/schema";

interface SessionPanelProps {
  conversation?: Conversation;
  files: FileType[];
  session?: Session;
}

export default function SessionPanel({ conversation, files, session }: SessionPanelProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return "📷";
    if (mimeType.includes('csv') || mimeType.includes('excel')) return "📊";
    if (mimeType === 'application/pdf') return "📄";
    if (mimeType === 'text/plain') return "📝";
    return "📁";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "processing": return "text-yellow-600";
      case "error": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  // Session statistics
  const messagesUsed = session?.messagesUsed || 0;
  const storageUsed = 0; // GB - calculated from uploaded files

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Session Details</h3>
        </div>
      </div>

      {/* Session Stats */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Model</span>
            <span className="text-sm font-medium text-gray-900">
              {conversation?.model || "GPT-4 Turbo"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Session time</span>
            <span className="text-sm font-medium text-gray-900">
              {session?.duration ? formatDuration(session.duration) : "0m"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Files processed</span>
            <span className="text-sm font-medium text-gray-900">
              {files.length} files
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Memory usage</span>
            <span className="text-sm font-medium text-gray-900">
              {session?.memoryUsage ? `${session.memoryUsage} MB` : "0 MB"}
            </span>
          </div>
        </div>
      </div>

      {/* Files in Session */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Files in Session</h4>
        {files.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <File className="mx-auto mb-2" size={24} />
            <p className="text-sm">No files uploaded</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="bg-gray-50 border border-gray-100 p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm">{getFileIcon(file.mimeType)}</span>
                  <span className="text-sm font-medium text-gray-900 truncate flex-1">
                    {file.originalName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>{formatFileSize(file.size)}</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getStatusColor(file.status)}`}
                  >
                    {file.status}
                  </Badge>
                </div>
                {file.status === "completed" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-primary hover:text-primary/80 h-auto p-0"
                  >
                    View Details
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start bg-gray-50 hover:bg-gray-100"
          >
            <FileText className="mr-2" size={16} />
            <div className="text-left">
              <div className="text-sm font-medium">Generate Report</div>
              <div className="text-xs text-gray-500">Create comprehensive analysis report</div>
            </div>
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start bg-gray-50 hover:bg-gray-100"
          >
            <Code className="mr-2" size={16} />
            <div className="text-left">
              <div className="text-sm font-medium">Export Code</div>
              <div className="text-xs text-gray-500">Download generated Python/R code</div>
            </div>
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start bg-gray-50 hover:bg-gray-100"
          >
            <Share2 className="mr-2" size={16} />
            <div className="text-left">
              <div className="text-sm font-medium">Share Session</div>
              <div className="text-xs text-gray-500">Collaborate with team members</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Session Statistics */}
      <div className="flex-1 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Session Statistics</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center space-x-1">
                <MessageSquare size={14} className="text-gray-500" />
                <span className="text-gray-600">Messages</span>
              </div>
              <span className="text-gray-900 font-medium">
                {messagesUsed}
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center space-x-1">
                <HardDrive size={14} className="text-gray-500" />
                <span className="text-gray-600">Files Processed</span>
              </div>
              <span className="text-gray-900 font-medium">
                {files.length} files
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center space-x-1">
                <Clock size={14} className="text-gray-500" />
                <span className="text-gray-600">Session Duration</span>
              </div>
              <span className="text-gray-900 font-medium">
                {session?.duration ? formatDuration(session.duration) : "0m"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
