import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

// Import the help content from the backend README
const helpContent = `
# zed-netd: Adaptive Wireless Network Daemon for Zed

**Requirements:**
- Linux with NetworkManager (nmcli)
- Node.js 18+

**Quick Start:**
1. Install NetworkManager: sudo apt update && sudo apt install network-manager
2. Run: node services/net/zed-netd.cjs
3. Use the REST API at 127.0.0.1:5088 for status and configuration.

**REST API Endpoints:**
- GET /status → { online, currentPath, ssid, priority }
- GET /state → current persisted state
- POST /trust { ssid } → add to trusted_ssids
- POST /untrust { ssid } → remove from trusted_ssids
- POST /ban { ssid } → add to banned_open_ssids
- POST /unban { ssid } → remove from banned_open_ssids
- POST /priority { list } → replace priority
- POST /satellite { enabled, relayUrl, authHeader, heartbeatMs }
- POST /wifi/trust-current → trust the currently connected Wi-Fi SSID
- POST /connect/now → trigger immediate failover scan

**Troubleshooting:**
- If you see 'nmcli: not found', install NetworkManager.
- For permission errors, run as a user with rights to control NetworkManager.
- The daemon auto-creates netd-state.json if missing.

**Integration:**
- The chat sidebar Help button shows this guide.
- The Settings button allows live editing of network priorities, trusted/banned SSIDs, and satellite options.
`;

export default function HelpSidebar({ onClose }: { onClose?: () => void }) {
  return (
    <div className="w-96 h-full flex flex-col zed-glass border-l border-purple-500/30 backdrop-blur-xl">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap size={18} className="text-purple-400" />
          <span className="font-bold text-lg text-foreground">Help & Network Guide</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">✕</Button>
        )}
      </div>
      <ScrollArea className="flex-1 p-4">
        <Card className="p-4 prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: helpContent.replace(/\n/g, '<br/>').replace(/\*\*/g, '') }} />
        </Card>
      </ScrollArea>
    </div>
  );
}
