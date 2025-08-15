import React from 'react';

const Header: React.FC = () => (
  <header className="w-full flex items-center justify-between px-8 py-6 border-b border-gray-200 shadow bg-white">
    <div className="flex items-center gap-4">
      <img src="/assets/Zebulon-ai-logo.png" alt="Zebulon Logo" className="h-12 w-12 rounded-full" />
      <span className="text-3xl font-extrabold tracking-wide text-gray-900 drop-shadow-lg">ZEBULON CORE</span>
    </div>
    <div className="flex items-center gap-4">
      <span className="bg-gray-100 text-green-600 px-4 py-2 rounded-2xl font-semibold text-lg shadow">Active</span>
    </div>
  </header>
);

export default Header;
