import React, { useState } from 'react';
import BrowserTab from './tabs/BrowserTab';
import ProjectsTab from './tabs/ProjectsTab';
import MeetingsTab from './tabs/MeetingsTab';
import NotesTab from './tabs/NotesTab';
import FilesTab from './tabs/FilesTab';

const TABS = [
  { key: 'browser', label: 'Browser', component: <BrowserTab /> },
  { key: 'projects', label: 'Projects', component: <ProjectsTab /> },
  { key: 'meetings', label: 'Meetings', component: <MeetingsTab /> },
  { key: 'notes', label: 'Notes', component: <NotesTab /> },
  { key: 'files', label: 'Files', component: <FilesTab /> },
];

export default function ZLabApp() {
  const [tab, setTab] = useState('browser');
  const active = TABS.find(t => t.key === tab) || TABS[0];
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-4 p-2 border-b">
        <h1 className="font-bold text-lg">ZLab</h1>
        <nav className="flex gap-2">
          {TABS.map(t => (
            <button key={t.key} className={tab === t.key ? 'font-bold underline' : ''} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </nav>
      </header>
      <main className="flex-1 overflow-auto">
        {active.component}
      </main>
    </div>
  );
}
