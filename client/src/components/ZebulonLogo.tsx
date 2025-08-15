import React from 'react';

interface ZebulonLogoProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ZebulonLogo: React.FC<ZebulonLogoProps> = ({
  width = 64,
  height = 64,
  className = '',
  style = {},
}) => (
  <div
    style={{
      width,
      height,
      background: '#222',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
    className={className}
  >
    <span
      style={{
        color: '#fff',
        fontSize: width / 2,
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
      }}
    >
      Z
    </span>
  </div>
);

export default ZebulonLogo;
