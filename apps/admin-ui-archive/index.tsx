// Admin UI entry (placeholder)
import React, { useState } from 'react';
import { ZebulonCoreButton, ZebulonCorePanel } from '@zebulon/memory-ui';
export default function AdminUI() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <ZebulonCoreButton onOpen={() => setOpen(true)} />
      {open && <ZebulonCorePanel
        appName="Admin UI"
        entity={{ kind: 'user', id: '' }}
        clientOpts={{
          baseUrl: process.env.NEXT_PUBLIC_MEMORY_API || 'http://localhost:5000/api/memory',
          tokenProvider: async () => localStorage.getItem('jwt') || ''
        }}
      />}
      <div>Admin UI - Zebulon Core</div>
    </header>
  );
}
