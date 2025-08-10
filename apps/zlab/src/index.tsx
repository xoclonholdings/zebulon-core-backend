import { ZebulonCoreButton, ZebulonCorePanel } from '@zebulon/memory-ui';
import { useState } from 'react';

export default function ZLabApp() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <ZebulonCoreButton onOpen={() => setOpen(true)} />
      {open && <ZebulonCorePanel
        appName="ZLab"
        entity={{ kind: 'user', id: '' }}
        clientOpts={{
          baseUrl: process.env.NEXT_PUBLIC_MEMORY_API || 'http://localhost:5000/api/memory',
          tokenProvider: async () => localStorage.getItem('jwt') || ''
        }}
      />}
      {/* ...rest of ZLab UI... */}
    </header>
  );
}
