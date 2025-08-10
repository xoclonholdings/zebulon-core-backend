import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Send, Activity, LogOut, Settings, MessageCircle, Shield, DollarSign, Wrench, Lock, Database, FolderTree } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
const zebulonLogoPath = "/Zed-ai-logo_1753441894358.png";
import OracleDatabase from './OracleDatabase';
import ModuleSettings from './ModuleSettings';
import ModuleIntegrationComponent from './ModuleIntegration';
import GenealogyModule from './GenealogyModule';



interface SystemStatus {
  oracleCore?: {
    active: boolean;
    memory: number;
    queries: number;
    uptime: string;
    lastActivity: string;
    databaseConnections: number;
    responseTime: string;
  };
  zedCore?: {
    active: boolean;
    memory: number;
    tasks: number;
  };
}


interface ModuleIntegration {
  id: string;
  moduleName: string;
  displayName: string;
  isConnected: boolean;
  integrationType?: 'url' | 'script' | 'embed' | null;
  integrationUrl?: string | null;
  integrationScript?: string | null;
  integrationEmbed?: string | null;
  integrationConfig?: any;
  connectedAppName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

import ZebulonLogo from './ZebulonLogo';

const PIN_CODE = '2025'; // Change as needed

const ZedLiteWelcome = ({ onSetup }: { onSetup: () => void }) => (
  <div className="fixed bottom-6 right-6 z-50 max-w-xs w-full bg-black border border-purple-700 rounded-2xl shadow-xl p-4 animate-fade-in">
    <div className="flex items-center mb-2">
      <ZebulonLogo size={32} className="mr-2" />
      <span className="font-bold text-purple-300 text-lg">Zed Lite</span>
    </div>
    <div className="text-white text-sm mb-3">
      Welcome! I can help you set up your login, personalize your dashboard, and more.<br />
      <span className="text-purple-400">Type a question or click below to begin setup.</span>
    </div>
    <button
      className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-white font-semibold hover:opacity-90 transition"
      onClick={onSetup}
    >
      Start Setup
    </button>
  </div>
);

const ZebulonSimple: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [showZedLite, setShowZedLite] = useState(false);

  // PIN lock overlay
  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-full max-w-xs p-6 bg-black border border-gray-800 rounded-2xl shadow-xl">
          <div className="flex flex-col items-center mb-6">
            <ZebulonLogo size={56} className="mb-2" />
            <div className="text-2xl font-bold text-white tracking-wide mb-1">ZEBULON</div>
            <div className="text-purple-400 text-sm mb-2">Enter PIN to unlock</div>
          </div>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (pin === PIN_CODE) {
                setUnlocked(true);
                setTimeout(() => setShowZedLite(true), 800);
              } else {
                setPinError('Incorrect PIN');
              }
            }}
            className="space-y-4"
          >
            <Input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              autoFocus
              value={pin}
              onChange={e => {
                setPin(e.target.value);
                setPinError('');
              }}
              placeholder="Enter PIN"
              className="text-center text-lg tracking-widest bg-black border-purple-700 text-white"
            />
            {pinError && <div className="text-red-400 text-xs text-center">{pinError}</div>}
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg">Unlock</Button>
          </form>
        </div>
      </div>
    );
  }

  // Main dashboard grid (official Zebulon UI)
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center">
          <ZebulonLogo size={40} className="mr-3" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent tracking-wide">ZEBULON</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-purple-400">Settings</Button>
        </div>
      </header>

      {/* Dashboard grid: 6 modules */}
      <main className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* ZED (Chat Interface) */}
        <Card className="bg-gradient-to-br from-purple-900 to-purple-700 border-purple-700 hover:shadow-lg transition cursor-pointer">
          <CardContent className="flex flex-col items-center py-8">
            <MessageCircle className="h-10 w-10 text-purple-300 mb-2" />
            <div className="font-semibold text-lg mb-1">ZED (Chat)</div>
            <div className="text-xs text-purple-200 mb-2">AI chat and assistant</div>
            <Badge className="bg-purple-700">Active</Badge>
          </CardContent>
        </Card>
        {/* ZYNC (IDE Interface) */}
        <Card className="bg-gradient-to-br from-green-900 to-green-700 border-green-700 hover:shadow-lg transition cursor-pointer">
          <CardContent className="flex flex-col items-center py-8">
            <Wrench className="h-10 w-10 text-green-300 mb-2" />
            <div className="font-semibold text-lg mb-1">ZYNC (IDE)</div>
            <div className="text-xs text-green-200 mb-2">Development tools</div>
            <Badge className="bg-green-700">Ready</Badge>
          </CardContent>
        </Card>
        {/* ZETA (Security Panel) */}
        <Card className="bg-gradient-to-br from-blue-900 to-blue-700 border-blue-700 hover:shadow-lg transition cursor-pointer">
          <CardContent className="flex flex-col items-center py-8">
            <Shield className="h-10 w-10 text-blue-300 mb-2" />
            <div className="font-semibold text-lg mb-1">ZETA (Security)</div>
            <div className="text-xs text-blue-200 mb-2">Security controls</div>
            <Badge className="bg-blue-700">Secured</Badge>
          </CardContent>
        </Card>
        {/* ZWAP! (Financial Utility) */}
        <Card className="bg-gradient-to-br from-pink-900 to-pink-700 border-pink-700 hover:shadow-lg transition cursor-pointer">
          <CardContent className="flex flex-col items-center py-8">
            <DollarSign className="h-10 w-10 text-pink-300 mb-2" />
            <div className="font-semibold text-lg mb-1">ZWAP! (Finance)</div>
            <div className="text-xs text-pink-200 mb-2">Financial utilities</div>
            <Badge className="bg-pink-700">Enabled</Badge>
          </CardContent>
        </Card>
        {/* LEGACY (Genealogy Archive) */}
        <Card className="bg-gradient-to-br from-cyan-900 to-cyan-700 border-cyan-700 hover:shadow-lg transition cursor-pointer">
          <CardContent className="flex flex-col items-center py-8">
            <FolderTree className="h-10 w-10 text-cyan-300 mb-2" />
            <div className="font-semibold text-lg mb-1">LEGACY (Genealogy)</div>
            <div className="text-xs text-cyan-200 mb-2">Family tree archive</div>
            <Badge className="bg-cyan-700">Ready</Badge>
          </CardContent>
        </Card>
        {/* Config (System Settings) */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-700 border-gray-700 hover:shadow-lg transition cursor-pointer">
          <CardContent className="flex flex-col items-center py-8">
            <Settings className="h-10 w-10 text-gray-300 mb-2" />
            <div className="font-semibold text-lg mb-1">Config (Settings)</div>
            <div className="text-xs text-gray-200 mb-2">System configuration</div>
            <Badge className="bg-gray-700">Configurable</Badge>
          </CardContent>
        </Card>
      </main>

      {/* Zed Lite Chatbot (floating) */}
      {showZedLite && <ZedLiteWelcome onSetup={() => alert('Setup flow coming soon!')} />}
    </div>
  );
}

export default ZebulonSimple;