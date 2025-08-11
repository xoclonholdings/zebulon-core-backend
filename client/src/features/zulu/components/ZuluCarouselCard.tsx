
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ZuluAPI } from '../api';
// import { CarouselCard } from '../../../components/carousel/SystemCarousel'; // Uncomment when CarouselCard exists

// Temporary fallback for CarouselCard if not present
const CarouselCard = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className="tile-3d min-w-[260px] max-w-[320px] rounded p-4 cursor-pointer select-none border border-black/10"
  >
    {children}
  </div>
);

type Brief = {
  ts: string;
  overallOk: boolean;
  dbMs: number | null;
  freePct: number | null;
  diskWarn: boolean;
  uploadsWritable: boolean;
  updates: { total: number; critical: number } | null;
  ticker: string[];
};

export default function ZuluCarouselCard() {

  const [brief, setBrief] = useState<Brief | null>(null);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateResult, setUpdateResult] = useState<string | null>(null);
  const nav = useNavigate();

  async function pullOnce() {
    try {
      const r = await ZuluAPI.brief();
      setBrief(r);
    } catch {}
  }

  async function handleUpdate() {
    setUpdating(true);
    setUpdateResult(null);
    try {
      const res = await ZuluAPI.update();
      setUpdateResult(res?.message || 'Update triggered.');
      pullOnce();
    } catch (e: any) {
      setUpdateResult(e?.message || 'Update failed.');
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    pullOnce();
    // subscribe to SSE health-brief
    const es = new EventSource(ZuluAPI.sseUrl());
    const onBrief = (e: MessageEvent) => {
      try { setBrief(JSON.parse(e.data)); } catch {}
    };
    es.addEventListener('health-brief', onBrief);
    return () => { es.removeEventListener('health-brief', onBrief as any); es.close(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // rotate ticker line every 4 seconds, pause if urgent or user interacts
  useEffect(() => {
    if (!brief || !Array.isArray(brief.ticker) || brief.ticker.length === 0 || paused) return;
    if (!brief.overallOk || brief.diskWarn) return; // pause auto-advance if urgent
    const id = setInterval(() => setTickerIdx(i => (i + 1) % brief.ticker.length), 4000);
    return () => clearInterval(id);
  }, [brief, paused]);

  const color = useMemo(() => {
    if (!brief) return 'border-gray-300';
    if (brief && !brief.overallOk) return 'border-red-400';
    if (brief && brief.diskWarn) return 'border-yellow-400';
    return 'border-green-400';
  }, [brief]);

  const updatesText = useMemo(() => {
    if (!brief || !brief.updates) return 'Updates: n/a';
    const { total, critical } = brief.updates;
    if (total === 0) return 'Fully up to date';
    return critical > 0 ? `Updates: ${total} (${critical} major)` : `Updates: ${total}`;
  }, [brief]);

  const diskPct = brief && brief.freePct != null ? Math.round(brief.freePct * 100) : null;

  return (
    <CarouselCard onClick={() => nav('/zulu')}>
      <div className={`rounded border ${color} p-2 relative`}>
        {/* Three-dot header for manual navigation */}
        <div className="flex justify-between items-center mb-1">
          {/* Zebulon Core button */}
          <button
            className="text-xs px-2 py-1 rounded bg-purple-700 text-white font-semibold hover:bg-purple-800 transition"
            onClick={e => { e.stopPropagation(); nav('/core'); }}
          >
            Zebulon Core
          </button>
          {/* Three-dot pager */}
          {brief && Array.isArray(brief.ticker) && brief.ticker.length > 1 && (
            <div className="flex gap-1">
              {brief.ticker.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show ticker ${i + 1}`}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${i === tickerIdx ? 'bg-black/80 scale-125' : 'bg-black/30 hover:bg-black/60'}`}
                  onClick={e => { e.stopPropagation(); setTickerIdx(i); setPaused(true); }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="text-xs opacity-70">ZULU — Repairs & Diagnostics</div>
        <div className="text-lg font-semibold mt-1">
          {brief ? (brief.overallOk ? 'System OK' : 'Attention Needed') : 'Loading…'}
        </div>
        <div className="mt-2 text-sm grid grid-cols-2 gap-2">
          <div>
            <div className="opacity-70 text-xs">DB</div>
            <div>{brief && brief.dbMs != null ? `${brief.dbMs} ms` : '—'}</div>
          </div>
          <div>
            <div className="opacity-70 text-xs">Disk Free</div>
            <div>{diskPct != null ? `${diskPct}%` : '—'}</div>
          </div>
          <div>
            <div className="opacity-70 text-xs">Uploads</div>
            <div>{brief && brief.uploadsWritable ? 'Writable' : 'Blocked'}</div>
          </div>
          <div>
            <div className="opacity-70 text-xs">Updates</div>
            <div>{updatesText}</div>
            {/* Update Now button if updates available */}
            {brief && brief.updates && brief.updates.total > 0 && (
              <button
                className="mt-1 text-xs px-2 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                disabled={updating}
                onClick={e => { e.stopPropagation(); handleUpdate(); }}
              >
                {updating ? 'Updating…' : 'Update Now'}
              </button>
            )}
            {updateResult && (
              <div className="mt-1 text-[10px] text-green-700">{updateResult}</div>
            )}
          </div>
        </div>
        <div className="mt-3 text-xs font-mono opacity-80 line-clamp-2">
          {brief && Array.isArray(brief.ticker) && brief.ticker.length ? brief.ticker[tickerIdx] : 'No recent events'}
        </div>
        <div className="mt-2 text-[10px] opacity-60">Tap for full dashboard</div>
      </div>
    </CarouselCard>
  );
}
