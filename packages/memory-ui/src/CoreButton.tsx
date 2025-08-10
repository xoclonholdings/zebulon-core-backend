import React from 'react';
export function ZebulonCoreButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button onClick={onOpen} style={{padding: '8px 16px', background: '#6c47ff', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 'bold'}}>
      Zebulon Core
    </button>
  );
}
