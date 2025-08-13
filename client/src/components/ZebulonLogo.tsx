
import React from 'react';

// ZebulonLogo component using the provided logo image
const ZebulonLogo: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <img
    src="/zebulon-logo.png"
    alt="Zebulon Logo"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', borderRadius: '16px', boxShadow: '0 2px 16px #a020f0' }}
  />
);

export default ZebulonLogo;
