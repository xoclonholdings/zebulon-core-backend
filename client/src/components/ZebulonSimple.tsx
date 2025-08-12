
// --- OFFICIAL ZEBULON UI DESIGN (from Zebulon repo, with tile names/order preserved) ---
import React, { useState, useEffect } from 'react';
import ZebulonLogo from './ZebulonLogo';
import ZedLiteWelcome from './ZedLiteWelcome';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import zebulonLogoPath from '/Zed-ai-logo_1753441894358.png';

import { MessageCircleIcon } from './icons/MessageCircle';
import { WrenchIcon } from './icons/Wrench';
import { ShieldIcon } from './icons/Shield';
import { DollarSignIcon } from './icons/DollarSign';
import { FolderTreeIcon } from './icons/FolderTree';
import { SettingsIcon } from './icons/Settings';



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

  // Debug output
  console.log('[ZebulonSimple] Rendered');
  console.log('[ZebulonSimple] State:', { showZedLite, showZedPanel, isMobile, activeTile });

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
      <div style={{position: 'fixed', top: 0, left: 0, zIndex: 9999, background: 'yellow', color: 'black', padding: 8}}>
        [DEBUG] ZebulonSimple rendered. State: {JSON.stringify({ showZedLite, showZedPanel, isMobile, activeTile })}
      </div>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div style={{background: 'orange', color: 'black', padding: 8, fontWeight: 'bold', marginTop: 8}}>[DEBUG] Header rendered</div>
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
        <main 
          className="flex-1 p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          style={{
            border: '4px solid #00ffea',
            background: '#18181b',
            zIndex: 10,
            opacity: 1,
            filter: 'none',
            position: 'relative',
          }}
        >
          <div style={{background: 'lime', color: 'black', padding: 16, fontWeight: 'bold', border: '2px solid #000', zIndex: 1000}}>[DEBUG] Main dashboard grid is visible</div>
          <div style={{background: 'cyan', color: 'black', padding: 16, fontWeight: 'bold', border: '2px solid #000', zIndex: 1000}}>[DEBUG] Dashboard tile 1</div>
          <div style={{background: 'magenta', color: 'black', padding: 16, fontWeight: 'bold', border: '2px solid #000', zIndex: 1000}}>[DEBUG] Dashboard tile 2</div>
          <div style={{background: 'yellow', color: 'black', padding: 16, fontWeight: 'bold', border: '2px solid #000', zIndex: 1000}}>[DEBUG] Dashboard tile 3</div>
          {/* ZED — AI Assistant */}
          <Card 
            className="bg-gradient-to-br from-purple-900 to-purple-700 border-purple-700 hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveTile('zed')}
            style={{
              border: '3px solid #a259ff',
              background: 'rgba(80,0,120,0.85)',
              zIndex: 100,
              opacity: 1,
              filter: 'none',
              position: 'relative',
            }}
          >
            <CardContent className="flex flex-col items-center py-8" style={{opacity: 1, filter: 'none', color: '#fff', zIndex: 101}}>
              <MessageCircleIcon className="h-10 w-10 text-purple-300 mb-2" />
              <div className="font-semibold text-lg mb-1">ZED — AI Assistant</div>
              <div className="text-xs text-purple-200 mb-2">Conversational AI & automation</div>
              <Badge className="bg-purple-700">Online</Badge>
              <div className="mt-2 text-xs text-purple-200 text-center">
                <div className="font-bold">Status:</div>
                <div>{mockData.zed.summary}</div>
                <div className="mt-1 italic">"{mockData.zed.conversation[mockData.zed.conversation.length-1].content}"</div>
              </div>
              <span className="mt-2 text-xs text-purple-200">Click to open assistant</span>
            </CardContent>
          </Card>
          {/* ZYNC — Creator IDE */}
          <Card 
            className="bg-gradient-to-br from-green-900 to-green-700 border-green-700 hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveTile('zync')}
            style={{
              border: '3px solid #00ffae',
              background: 'rgba(0,80,40,0.85)',
              zIndex: 100,
              opacity: 1,
              filter: 'none',
              position: 'relative',
            }}
          >
            <CardContent className="flex flex-col items-center py-8" style={{opacity: 1, filter: 'none', color: '#fff', zIndex: 101}}>
              <WrenchIcon className="h-10 w-10 text-green-300 mb-2" />
              <div className="font-semibold text-lg mb-1">ZYNC — Creator IDE</div>
              <div className="text-xs text-green-200 mb-2">Build, code, and create</div>
              <Badge className="bg-green-700">Ready</Badge>
              <div className="mt-2 text-xs text-green-200 text-center">
                <div className="font-bold">Repos:</div>
                <div>{mockData.zync.repos.join(', ')}</div>
                <div className="mt-1">Last build: <span className="italic">{mockData.zync.builds[mockData.zync.builds.length-1].status}</span></div>
              </div>
            </CardContent>
          </Card>
          {/* ZETA — Security & Firewall */}
          <Card 
            className="bg-gradient-to-br from-blue-900 to-blue-700 border-blue-700 hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveTile('zeta')}
            style={{
              border: '3px solid #00eaff',
              background: 'rgba(0,40,120,0.85)',
              zIndex: 100,
              opacity: 1,
              filter: 'none',
              position: 'relative',
            }}
          >
            <CardContent className="flex flex-col items-center py-8" style={{opacity: 1, filter: 'none', color: '#fff', zIndex: 101}}>
              <ShieldIcon className="h-10 w-10 text-blue-300 mb-2" />
              <div className="font-semibold text-lg mb-1">ZETA — Security & Firewall</div>
              <div className="text-xs text-blue-200 mb-2">Security, firewall & access</div>
              <Badge className="bg-blue-700">Secured</Badge>
              <div className="mt-2 text-xs text-blue-200 text-center">
                <div className="font-bold">Firewall:</div>
                <div>{mockData.zeta.firewall}</div>
                <div>Threats: <span className="font-bold">{mockData.zeta.threats}</span></div>
                <div className="mt-1 italic">Last: {mockData.zeta.logs[mockData.zeta.logs.length-1].event}</div>
              </div>
            </CardContent>
          </Card>
          {/* ZWAP! — Finance & Supply */}
          <Card 
            className="bg-gradient-to-br from-pink-900 to-pink-700 border-pink-700 hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveTile('zwap')}
            style={{
              border: '3px solid #ff00ae',
              background: 'rgba(120,0,80,0.85)',
              zIndex: 100,
              opacity: 1,
              filter: 'none',
              position: 'relative',
            }}
          >
            <CardContent className="flex flex-col items-center py-8" style={{opacity: 1, filter: 'none', color: '#fff', zIndex: 101}}>
              <DollarSignIcon className="h-10 w-10 text-pink-300 mb-2" />
              <div className="font-semibold text-lg mb-1">ZWAP! — Finance & Supply</div>
              <div className="text-xs text-pink-200 mb-2">Finance, billing & supply chain</div>
              <Badge className="bg-pink-700">Enabled</Badge>
              <div className="mt-2 text-xs text-pink-200 text-center">
                <div className="font-bold">Balance:</div>
                <div>${mockData.zwap.balance}</div>
                <div>Supply: {mockData.zwap.supply.join(', ')}</div>
                <div className="mt-1 italic">Last order: {mockData.zwap.orders[mockData.zwap.orders.length-1].item}</div>
              </div>
            </CardContent>
          </Card>
          {/* ZLab — Collaboration Hub */}
          <Card 
            className="bg-gradient-to-br from-cyan-900 to-cyan-700 border-cyan-700 hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveTile('zlab')}
            style={{
              border: '3px solid #00fff7',
              background: 'rgba(0,120,120,0.85)',
              zIndex: 100,
              opacity: 1,
              filter: 'none',
              position: 'relative',
            }}
          >
            <CardContent className="flex flex-col items-center py-8" style={{opacity: 1, filter: 'none', color: '#fff', zIndex: 101}}>
              <FolderTreeIcon className="h-10 w-10 text-cyan-300 mb-2" />
              <div className="font-semibold text-lg mb-1">ZLab — Collaboration Hub</div>
              <div className="text-xs text-cyan-200 mb-2">Collaboration & genealogy</div>
              <Badge className="bg-cyan-700">Ready</Badge>
              <div className="mt-2 text-xs text-cyan-200 text-center">
                <div className="font-bold">Projects:</div>
                <div>{mockData.zlab.projects.join(', ')}</div>
                <div>Tasks: {mockData.zlab.tasks.length}</div>
                <div className="mt-1 italic">Next: {mockData.zlab.meetings[0]?.topic || 'N/A'}</div>
              </div>
            </CardContent>
          </Card>
          {/* ZULU — System Diagnostics & Dashboard */}
          <Card 
            className="bg-gradient-to-br from-gray-900 to-gray-700 border-gray-700 hover:shadow-lg transition cursor-pointer"
            onClick={() => setActiveTile('zulu')}
            style={{
              border: '3px solid #aaa',
              background: 'rgba(80,80,80,0.85)',
              zIndex: 100,
              opacity: 1,
              filter: 'none',
              position: 'relative',
            }}
          >
            <CardContent className="flex flex-col items-center py-8" style={{opacity: 1, filter: 'none', color: '#fff', zIndex: 101}}>
              <SettingsIcon className="h-10 w-10 text-gray-300 mb-2" />
              <div className="font-semibold text-lg mb-1">ZULU — System Diagnostics & Dashboard</div>
              <div className="text-xs text-gray-200 mb-2">Diagnostics & system overview</div>
              <Badge className="bg-gray-700">Configurable</Badge>
              <div className="mt-2 text-xs text-gray-200 text-center">
                <div className="font-bold">CPU:</div>
                <div>{mockData.zulu.metrics.cpu}% | Mem: {mockData.zulu.metrics.mem}%</div>
                <div>Diagnostics: <span className="italic">{mockData.zulu.diagnostics}</span></div>
                <div className="mt-1 italic">{mockData.zulu.news[0]}</div>
              </div>
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