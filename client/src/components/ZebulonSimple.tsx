import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { MessageCircleIcon } from './icons/MessageCircle';
import { WrenchIcon } from './icons/Wrench';
import { ShieldIcon } from './icons/Shield';
import { DollarSignIcon } from './icons/DollarSign';
import { FolderTreeIcon } from './icons/FolderTree';
import { SettingsIcon } from './icons/Settings';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
const zebulonLogoPath = "/Zed-ai-logo_1753441894358.png";

import OracleDatabase from './OracleDatabase';
import ModuleSettings from './ModuleSettings';
import ModuleIntegrationComponent from './ModuleIntegration';
import GenealogyModule from './GenealogyModule';

import { useEffect } from 'react';



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
  // PIN lock removed for now; always unlocked

  const [showZedLite, setShowZedLite] = useState(false);
  const [showZedPanel, setShowZedPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Tile modal state
  const [activeTile, setActiveTile] = useState<null | 'zed' | 'zeta' | 'zlab' | 'zwap' | 'zync' | 'zulu'>(null);

  // API mock fallback for local/dev
  const mockData = {
    zed: { conversation: [{ role: 'user', content: 'Hello ZED!' }, { role: 'ai', content: 'Hello, how can I help you today?' }], summary: 'ZED is online.' },
    zeta: { threats: 2, firewall: 'active', logs: [{ time: '2025-08-11', event: 'Blocked intrusion attempt' }] },
    zlab: { projects: ['Project Alpha', 'Project Beta'], tasks: [{ name: 'Design UI', status: 'in progress' }], meetings: [{ topic: 'Sprint Planning', time: '10:00' }] },
    zwap: { balance: 1200.50, supply: ['Widget A', 'Widget B'], orders: [{ id: 1, item: 'Widget A', status: 'shipped' }] },
    zync: { repos: ['zebulon-core', 'zync-ide'], builds: [{ id: 1, status: 'success' }], git: 'connected' },
    zulu: { metrics: { cpu: 32, mem: 68 }, news: ['System update available', 'All systems nominal'], diagnostics: 'OK' },
  };

  function fetchWithMock(url: string, key: keyof typeof mockData) {
    // Use real API if available, else fallback to mock
    return fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .catch(() => mockData[key]);
  }

  const zedQuery = useQuery({
    queryKey: ['zed-core'],
    queryFn: () => fetchWithMock('/api/zed', 'zed'),
    enabled: activeTile === 'zed',
  });
  const zetaQuery = useQuery({
    queryKey: ['zeta-core'],
    queryFn: () => fetchWithMock('/api/zeta', 'zeta'),
    enabled: activeTile === 'zeta',
  });
  const zlabQuery = useQuery({
    queryKey: ['zlab-core'],
    queryFn: () => fetchWithMock('/api/zlab', 'zlab'),
    enabled: activeTile === 'zlab',
  });
  const zwapQuery = useQuery({
    queryKey: ['zwap-core'],
    queryFn: () => fetchWithMock('/api/zwap', 'zwap'),
    enabled: activeTile === 'zwap',
  });
  const zyncQuery = useQuery({
    queryKey: ['zync-core'],
    queryFn: () => fetchWithMock('/api/zync', 'zync'),
    enabled: activeTile === 'zync',
  });
  const zuluQuery = useQuery({
    queryKey: ['zulu-core'],
    queryFn: () => fetchWithMock('/api/zulu', 'zulu'),
    enabled: activeTile === 'zulu',
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // PIN lock overlay removed; dashboard always visible until after login/setup is implemented


  // Main dashboard grid (official Zebulon UI) with persistent Zed chat panel
  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col">
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

      <div className="flex-1 flex flex-row min-h-0">
        {/* Main dashboard grid: 6 modules */}
        <main className="flex-1 p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* ZED — AI Assistant */}
          <Card className="bg-gradient-to-br from-purple-900 to-purple-700 border-purple-700 hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveTile('zed')}>
            <CardContent className="flex flex-col items-center py-8">
              <MessageCircleIcon className="h-10 w-10 text-purple-300 mb-2" />
              <div className="font-semibold text-lg mb-1">ZED — AI Assistant</div>
              <div className="text-xs text-purple-200 mb-2">Conversational AI & automation</div>
              <Badge className="bg-purple-700">Online</Badge>
              <span className="mt-2 text-xs text-purple-200">Click to open assistant</span>
            </CardContent>
          </Card>
          {/* ZYNC — Creator IDE */}
          <Card className="bg-gradient-to-br from-green-900 to-green-700 border-green-700 hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveTile('zync')}>
            <CardContent className="flex flex-col items-center py-8">
              <WrenchIcon className="h-10 w-10 text-green-300 mb-2" />
              <div className="font-semibold text-lg mb-1">ZYNC — Creator IDE</div>
              <div className="text-xs text-green-200 mb-2">Build, code, and create</div>
              <Badge className="bg-green-700">Ready</Badge>
            </CardContent>
          </Card>
          {/* ZETA — Security & Firewall */}
          <Card className="bg-gradient-to-br from-blue-900 to-blue-700 border-blue-700 hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveTile('zeta')}>
            <CardContent className="flex flex-col items-center py-8">
              <ShieldIcon className="h-10 w-10 text-blue-300 mb-2" />
              <div className="font-semibold text-lg mb-1">ZETA — Security & Firewall</div>
              <div className="text-xs text-blue-200 mb-2">Security, firewall & access</div>
              <Badge className="bg-blue-700">Secured</Badge>
            </CardContent>
          </Card>
          {/* ZWAP! — Finance & Supply */}
          <Card className="bg-gradient-to-br from-pink-900 to-pink-700 border-pink-700 hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveTile('zwap')}>
            <CardContent className="flex flex-col items-center py-8">
              <DollarSignIcon className="h-10 w-10 text-pink-300 mb-2" />
              <div className="font-semibold text-lg mb-1">ZWAP! — Finance & Supply</div>
              <div className="text-xs text-pink-200 mb-2">Finance, billing & supply chain</div>
              <Badge className="bg-pink-700">Enabled</Badge>
            </CardContent>
          </Card>
          {/* ZLab — Collaboration Hub */}
          <Card className="bg-gradient-to-br from-cyan-900 to-cyan-700 border-cyan-700 hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveTile('zlab')}>
            <CardContent className="flex flex-col items-center py-8">
              <FolderTreeIcon className="h-10 w-10 text-cyan-300 mb-2" />
              <div className="font-semibold text-lg mb-1">ZLab — Collaboration Hub</div>
              <div className="text-xs text-cyan-200 mb-2">Collaboration & genealogy</div>
              <Badge className="bg-cyan-700">Ready</Badge>
            </CardContent>
          </Card>
          {/* ZULU — System Diagnostics & Dashboard */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-700 border-gray-700 hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveTile('zulu')}>
            <CardContent className="flex flex-col items-center py-8">
              <SettingsIcon className="h-10 w-10 text-gray-300 mb-2" />
              <div className="font-semibold text-lg mb-1">ZULU — System Diagnostics & Dashboard</div>
              <div className="text-xs text-gray-200 mb-2">Diagnostics & system overview</div>
              <Badge className="bg-gray-700">Configurable</Badge>
            </CardContent>
          </Card>
        </main>

        {/* Tile Modal: Shows data from backend partition for each tile */}
        {activeTile && (
          <div className={isMobile ?
            'fixed inset-0 z-50 bg-black/80 flex flex-col' :
            'w-[520px] max-w-full border-l border-gray-800 bg-black/95 z-30 flex flex-col shadow-2xl'}>
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-black/90">
              <span className="font-bold text-purple-300 text-lg flex items-center">
                {activeTile === 'zed' && <MessageCircleIcon className="mr-2" />} 
                {activeTile === 'zeta' && <ShieldIcon className="mr-2" />} 
                {activeTile === 'zlab' && <FolderTreeIcon className="mr-2" />} 
                {activeTile === 'zwap' && <DollarSignIcon className="mr-2" />} 
                {activeTile === 'zync' && <WrenchIcon className="mr-2" />} 
                {activeTile === 'zulu' && <SettingsIcon className="mr-2" />} 
                {activeTile === 'zed' && 'ZED — AI Assistant'}
                {activeTile === 'zeta' && 'ZETA — Security & Firewall'}
                {activeTile === 'zlab' && 'ZLab — Collaboration Hub'}
                {activeTile === 'zwap' && 'ZWAP! — Finance & Supply'}
                {activeTile === 'zync' && 'ZYNC — Creator IDE'}
                {activeTile === 'zulu' && 'ZULU — System Diagnostics & Dashboard'}
              </span>
              <Button variant="ghost" onClick={() => setActiveTile(null)} className="text-purple-400">Close</Button>
            </div>
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 w-full max-w-xl mx-auto">
              {/* Advanced UI for each tile with error handling */}
              {activeTile === 'zed' && (
                <>
                  <div className="text-purple-200 text-lg font-bold mb-2">ZED — AI Assistant</div>
                  {zedQuery.isLoading && <div>Loading ZED data...</div>}
                  {zedQuery.isError && <div className="text-red-400">Error loading ZED data.</div>}
                  {zedQuery.data && (
                    <>
                      <div className="mb-2">Summary: {zedQuery.data.summary}</div>
                      <div className="bg-black/40 rounded p-3 mb-2">
                        <div className="font-semibold mb-1">Conversation:</div>
                        <ul className="text-xs">
                          {zedQuery.data.conversation.map((msg: any, i: number) => (
                            <li key={i}><span className="font-bold">{msg.role}:</span> {msg.content}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </>
              )}
              {activeTile === 'zeta' && (
                <>
                  <div className="text-blue-200 text-lg font-bold mb-2">ZETA — Security & Firewall</div>
                  {zetaQuery.isLoading && <div>Loading ZETA data...</div>}
                  {zetaQuery.isError && <div className="text-red-400">Error loading ZETA data.</div>}
                  {zetaQuery.data && (
                    <>
                      <div className="mb-2">Firewall: <span className="font-bold">{zetaQuery.data.firewall}</span></div>
                      <div className="mb-2">Threats: <span className="font-bold">{zetaQuery.data.threats}</span></div>
                      <div className="bg-black/40 rounded p-3 mb-2">
                        <div className="font-semibold mb-1">Logs:</div>
                        <ul className="text-xs">
                          {zetaQuery.data.logs.map((log: any, i: number) => (
                            <li key={i}>{log.time}: {log.event}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </>
              )}
              {activeTile === 'zlab' && (
                <>
                  <div className="text-cyan-200 text-lg font-bold mb-2">ZLab — Collaboration Hub</div>
                  {zlabQuery.isLoading && <div>Loading ZLab data...</div>}
                  {zlabQuery.isError && <div className="text-red-400">Error loading ZLab data.</div>}
                  {zlabQuery.data && (
                    <>
                      <div className="mb-2">Projects: {zlabQuery.data.projects.join(', ')}</div>
                      <div className="mb-2">Tasks:</div>
                      <ul className="text-xs mb-2">
                        {zlabQuery.data.tasks.map((task: any, i: number) => (
                          <li key={i}>{task.name} — <span className="italic">{task.status}</span></li>
                        ))}
                      </ul>
                      <div className="mb-2">Meetings:</div>
                      <ul className="text-xs">
                        {zlabQuery.data.meetings.map((m: any, i: number) => (
                          <li key={i}>{m.topic} at {m.time}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
              {activeTile === 'zwap' && (
                <>
                  <div className="text-pink-200 text-lg font-bold mb-2">ZWAP! — Finance & Supply</div>
                  {zwapQuery.isLoading && <div>Loading ZWAP! data...</div>}
                  {zwapQuery.isError && <div className="text-red-400">Error loading ZWAP! data.</div>}
                  {zwapQuery.data && (
                    <>
                      <div className="mb-2">Wallet Balance: <span className="font-bold">${zwapQuery.data.balance}</span></div>
                      <div className="mb-2">Supply: {zwapQuery.data.supply.join(', ')}</div>
                      <div className="mb-2">Orders:</div>
                      <ul className="text-xs">
                        {zwapQuery.data.orders.map((order: any, i: number) => (
                          <li key={i}>Order #{order.id}: {order.item} — <span className="italic">{order.status}</span></li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
              {activeTile === 'zync' && (
                <>
                  <div className="text-green-200 text-lg font-bold mb-2">ZYNC — Creator IDE</div>
                  {zyncQuery.isLoading && <div>Loading ZYNC data...</div>}
                  {zyncQuery.isError && <div className="text-red-400">Error loading ZYNC data.</div>}
                  {zyncQuery.data && (
                    <>
                      <div className="mb-2">Repos: {zyncQuery.data.repos.join(', ')}</div>
                      <div className="mb-2">Builds:</div>
                      <ul className="text-xs mb-2">
                        {zyncQuery.data.builds.map((build: any, i: number) => (
                          <li key={i}>Build #{build.id}: <span className="italic">{build.status}</span></li>
                        ))}
                      </ul>
                      <div className="mb-2">Git: <span className="italic">{zyncQuery.data.git}</span></div>
                    </>
                  )}
                </>
              )}
              {activeTile === 'zulu' && (
                <>
                  <div className="text-gray-200 text-lg font-bold mb-2">ZULU — System Diagnostics & Dashboard</div>
                  {zuluQuery.isLoading && <div>Loading ZULU data...</div>}
                  {zuluQuery.isError && <div className="text-red-400">Error loading ZULU data.</div>}
                  {zuluQuery.data && (
                    <>
                      <div className="mb-2">CPU: <span className="font-bold">{zuluQuery.data.metrics.cpu}%</span> | Memory: <span className="font-bold">{zuluQuery.data.metrics.mem}%</span></div>
                      <div className="mb-2">Diagnostics: <span className="italic">{zuluQuery.data.diagnostics}</span></div>
                      <div className="mb-2">News/Events:</div>
                      <ul className="text-xs">
                        {zuluQuery.data.news.map((n: string, i: number) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Zed Lite Chatbot (floating) */}
      {showZedLite && <ZedLiteWelcome onSetup={() => alert('Setup flow coming soon!')} />}
    </div>
  );
}

export default ZebulonSimple;