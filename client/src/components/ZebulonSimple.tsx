// --- OFFICIAL ZEBULON UI DESIGN (from Zebulon repo, with tile names/order preserved) ---
import React, { useEffect, useState } from 'react';
import ZebulonLogo from './ZebulonLogo';

const ZebulonSimple: React.FC = () => {
  // Comment out time logic for SSR isolation
  // const [time, setTime] = useState('');
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     setTime(new Date().toLocaleTimeString());
  //     const interval = setInterval(() => {
  //       setTime(new Date().toLocaleTimeString());
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   }
  // }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 border-b border-[#23234b] shadow-lg bg-black">
        <div className="flex items-center gap-4">
          <ZebulonLogo width={48} height={48} className="mr-4" />
          <span className="text-3xl font-extrabold tracking-wide text-white drop-shadow-lg" style={{textShadow: '0 2px 16px #a020f0, 0 0 2px #fff'}}>ZEBULON</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-[#23234b] text-green-300 px-4 py-2 rounded-2xl font-semibold text-lg shadow" style={{marginRight: '1rem'}}>Zebulon Core</span>
        </div>
      </header>
    </div>
  );
};

export default ZebulonSimple;