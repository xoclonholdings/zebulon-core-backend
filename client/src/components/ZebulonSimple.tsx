// --- OFFICIAL ZEBULON UI DESIGN (from Zebulon repo, with tile names/order preserved) ---
import React from 'react';
import ZebulonLogo from './ZebulonLogo';

const ZebulonSimple: React.FC = () => {
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
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center">
        <main className="grid grid-cols-3 grid-rows-2 gap-y-10 gap-x-8 w-full max-w-4xl mx-auto">
          {/* Static MVP tile buttons (no logic) */}
          <button className="bg-black border-2 border-[#23234b] rounded-[32px] flex flex-col items-center justify-center py-8 px-2" style={{height: '240px', width: '200px'}}>ZED</button>
          <button className="bg-black border-2 border-[#23234b] rounded-[32px] flex flex-col items-center justify-center py-8 px-2" style={{height: '240px', width: '200px'}}>ZYNC</button>
          <button className="bg-black border-2 border-[#23234b] rounded-[32px] flex flex-col items-center justify-center py-8 px-2" style={{height: '240px', width: '200px'}}>ZETA</button>
          <button className="bg-black border-2 border-[#23234b] rounded-[32px] flex flex-col items-center justify-center py-8 px-2" style={{height: '240px', width: '200px'}}>ZWAP!</button>
          <button className="bg-black border-2 border-[#23234b] rounded-[32px] flex flex-col items-center justify-center py-8 px-2" style={{height: '240px', width: '200px'}}>ZULU</button>
          <button className="bg-black border-2 border-[#23234b] rounded-[32px] flex flex-col items-center justify-center py-8 px-2" style={{height: '240px', width: '200px'}}>Config</button>
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