import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, User, Eye, FileText } from "lucide-react";
import type { Message } from "@shared/schema";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const formatContent = (content: string) => {
    // Basic markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        // Handle code blocks (simplified)
        if (line.trim().startsWith('```')) {
          return null; // Skip for now, would need proper code block handling
        }
        
        // Handle bullet points
        if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
          return (
            <li key={index} className="ml-4">
              {line.trim().substring(2)}
            </li>
          );
        }

        // Handle empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }

        // Regular paragraphs
        return <p key={index}>{line}</p>;
      });
  };

  if (isUser) {
    return (
      <div className="flex items-start space-x-4 justify-end">
        <div className="flex-1 max-w-3xl">
          <Card className="bg-primary text-white shadow-sm p-4 ml-12">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium opacity-90">You</span>
            </div>
            <div className="prose prose-sm max-w-none text-white prose-headings:text-white prose-p:text-white">
              {formatContent(message.content)}
            </div>
          </Card>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="text-gray-600" size={16} />
        </div>
      </div>
    );
  }

  if (isAssistant) {
    // Try to parse metadata for special content
    let metadata = null;
    try {
      metadata = message.metadata ? JSON.parse(JSON.stringify(message.metadata)) : null;
    } catch (e) {
      // Ignore parsing errors
    }

    return (
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <Brain className="text-white" size={16} />
        </div>
        <div className="flex-1">
          <Card className="bg-white shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-gray-900">ZED</span>
              <span className="text-xs text-gray-500">Assistant</span>
            </div>
            
            <div className="prose prose-sm max-w-none text-gray-700">
              {formatContent(message.content)}
            </div>

            {/* File Analysis Results */}
            {metadata?.files && (
              <div className="mt-4 space-y-3">
                {metadata.files.map((file: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="text-blue-500" size={16} />
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-500">{file.size}</span>
                    </div>
                    {file.description && (
                      <p className="text-sm text-gray-600">{file.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Analysis Results */}
            {metadata?.analysis && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  📊 Analysis Results
                </h4>
                <div className="text-sm text-blue-800">
                  {typeof metadata.analysis === 'object' ? (
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {JSON.stringify(metadata.analysis, null, 2)}
                    </pre>
                  ) : (
                    <p>{metadata.analysis}</p>
                  )}
                </div>
              </div>
            )}

            {/* Code Preview */}
            {metadata?.code && (
              <div className="mt-4 bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Generated Code</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-blue-400 hover:text-blue-300 h-auto p-1"
                  >
                    <Eye size={12} className="mr-1" />
                    View Full Code
                  </Button>
                </div>
                <pre className="text-sm text-gray-300">
                  <code>{metadata.code}</code>
                </pre>
              </div>
            )}

            {/* Timestamp */}
            <div className="mt-3 text-xs text-gray-400">
              {new Date(message.createdAt!).toLocaleTimeString()}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
