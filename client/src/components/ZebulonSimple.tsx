
// --- OFFICIAL ZEBULON UI DESIGN (from Zebulon repo, with tile names/order preserved) ---
import React, { useState, useEffect } from 'react';
import ZebulonLogo from './ZebulonLogo';
import ZedLiteWelcome from './ZedLiteWelcome';
// ...existing code...

import { MessageCircle, Wrench, Shield, DollarSign, Settings } from 'lucide-react';



const ZebulonSimple: React.FC = () => {

  // PIN lock removed for now; always unlocked
  const [showZedLite, setShowZedLite] = useState(false);
  const [showZedPanel, setShowZedPanel] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Tile modal state
  const [activeTile, setActiveTile] = useState<null | 'zed' | 'zeta' | 'zlab' | 'zwap' | 'zync' | 'zulu'>(null);
  // ...existing code...
  // ...existing code...
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header - matches reference image */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-[#23234b] shadow-lg bg-black">
        <div className="flex items-center gap-4">
          <ZebulonLogo size={48} className="mr-4" />
          <span className="text-3xl font-extrabold tracking-wide text-white drop-shadow-lg" style={{textShadow: '0 2px 16px #a020f0, 0 0 2px #fff'}}>ZEBULON</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-[#23234b] text-green-300 px-4 py-2 rounded-2xl font-semibold text-lg shadow" style={{marginRight: '1rem'}}>Zebulon Core</span>
          <button className="text-gray-300 hover:text-purple-400 text-xl" title="Logout">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center">
        <main className="grid grid-cols-3 grid-rows-2 gap-y-10 gap-x-8 w-full max-w-4xl mx-auto">
          {/* ZED — Chat Interface */}
          <button className="bg-black border-2 border-[#23234b] rounded-[32px] flex flex-col items-center justify-center py-8 px-2 transition hover:border-purple-400" style={{height: '240px', width: '200px'}}>
            <MessageCircle className="h-14 w-14 text-purple-300 mb-4" />
            <div className="font-extrabold text-2xl mb-2">ZED</div>
            <div className="text-lg text-gray-300 font-medium">Chat Interface</div>
          </button>
          {/* ZYNC — IDE Interface */}
          <button className="bg-black border-2 border-[#23234b] rounded-[32px] flex flex-col items-center justify-center py-8 px-2 transition hover:border-green-400" style={{height: '240px', width: '200px'}}>
            <Wrench className="h-14 w-14 text-green-300 mb-4" />
            <div className="font-extrabold text-2xl mb-2">ZYNC</div>
            <div className="text-lg text-gray-300 font-medium">IDE Interface</div>
          </button>
          {/* ZETA — Security Panel */}
          <button className="bg-black border-2 border-[#23234b] rounded-[32px] flex flex-col items-center justify-center py-8 px-2 transition hover:border-blue-400" style={{height: '240px', width: '200px'}}>
            <Shield className="h-14 w-14 text-blue-300 mb-4" />
            <div className="font-extrabold text-2xl mb-2">ZETA</div>
            <div className="text-lg text-gray-300 font-medium">Security Panel</div>
          </button>
          {/* ZWAP! — Financial Utility */}
          <button className="bg-black border-2 border-[#23234b] rounded-[32px] flex flex-col items-center justify-center py-8 px-2 transition hover:border-pink-400" style={{height: '240px', width: '200px'}}>
            <DollarSign className="h-14 w-14 text-pink-300 mb-4" />
            <div className="font-extrabold text-2xl mb-2">ZWAP!</div>
            <div className="text-lg text-gray-300 font-medium">Financial Utility</div>
          </button>
          {/* ZULU — System Repairs */}
          <button className="bg-black border-2 border-[#23234b] rounded-[32px] flex flex-col items-center justify-center py-8 px-2 transition hover:border-orange-400" style={{height: '240px', width: '200px'}}>
            <Wrench className="h-14 w-14 text-orange-400 mb-4" />
            <div className="font-extrabold text-2xl mb-2">ZULU</div>
            <div className="text-lg text-gray-300 font-medium">System Repairs</div>
          </button>
          {/* Config — System Settings */}
          <button className="bg-black border-2 border-[#23234b] rounded-[32px] flex flex-col items-center justify-center py-8 px-2 transition hover:border-gray-400" style={{height: '240px', width: '200px'}}>
            <Settings className="h-14 w-14 text-gray-300 mb-4" />
            <div className="font-extrabold text-2xl mb-2">Config</div>
            <div className="text-lg text-gray-300 font-medium">System Settings</div>
          </button>
        </main>
        {/* Footer status bar */}
        <div className="w-full max-w-2xl mt-12 bg-black border-2 border-[#23234b] rounded-[32px] flex items-center justify-between px-8 py-4 text-lg" style={{marginBottom: '2rem'}}>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-2"></span>
            <span className="text-green-300 font-semibold">Zebulon Core Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
            <span className="text-blue-300 font-semibold">Database Connected</span>
          </div>
          <div className="text-gray-300 font-mono">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
}

export default ZebulonSimple;