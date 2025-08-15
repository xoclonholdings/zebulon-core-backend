import React from 'react';

interface TileProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

const Tile: React.FC<TileProps> = ({ title, subtitle, icon, className = '', children }) => (
  <div className={`bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 m-2 min-w-[160px] min-h-[160px] max-w-[220px] max-h-[220px] ${className}`}
    style={{ boxSizing: 'border-box' }}>
    {icon && <div className="mb-2">{icon}</div>}
    <div className="font-bold text-xl text-gray-900 mb-1">{title}</div>
    {subtitle && <div className="text-sm text-gray-500 mb-2">{subtitle}</div>}
    {children}
  </div>
);

export default Tile;
