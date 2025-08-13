import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/header.css";

function useClock() {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const align = () => {
      const d = new Date();
      const ms = (60 - d.getSeconds()) * 1000 - d.getMilliseconds();
      const t0 = setTimeout(() => {
        tick();
        const id = setInterval(tick, 60_000);
        (window as any).__zClock = id;
      }, Math.max(0, ms));
      return () => clearTimeout(t0);
    };
    const cleanup = align();
    return () => {
      cleanup();
      if ((window as any).__zClock) clearInterval((window as any).__zClock);
    };
  }, []);
  return useMemo(() => {
    const d = now;
    const day = d.toLocaleDateString(undefined, { weekday: "short" });
    const mon = d.toLocaleDateString(undefined, { month: "short" });
    const date = d.getDate();
    const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return `${day}, ${mon} ${date} ${time}`;
  }, [now]);
}

function DatabaseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3c-4.97 0-9 1.34-9 3v12c0 1.66 4.03 3 9 3s9-1.34 9-3V6c0-1.66-4.03-3-9-3zm0 2c3.9 0 7 .9 7 2s-3.1 2-7 2-7-.9-7-2 3.1-2 7-2zm0 6c3.9 0 7-.9 7-2v3c0 1.1-3.1 2-7 2s-7-.9-7-2V9c0 1.1 3.1 2 7 2zm0 7c-3.9 0-7-.9-7-2v-3c0 1.1 3.1 2 7 2s7-.9 7-2v3c0 1.1-3.1 2-7 2z"/>
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.59a.5.5 0 0 0 .12-.64l-1.93-3.34a.5.5 0 0 0-.6-.23l-2.39.96a7.34 7.34 0 0 0-1.63-.95l-.36-2.54A.5.5 0 0 0 14.9 1h-3.8a.5.5 0 0 0-.49.41l-.36 2.54c-.58.23-1.12.54-1.63.95l-2.39-.96a.5.5 0 0 0-.6.23L1.8 7.06a.5.5 0 0 0 .12.64l2.03 1.59c-.04.31-.06.63-.06.94s.02.63.06.94L1.92 13.7a.5.5 0 0 0-.12.64l1.93 3.34c.14.24.43.34.69.23l2.39-.96c.51.41 1.05.72 1.63.95l.36 2.54c.06.24.26.41.49.41h3.8c.24 0 .44-.17.49-.41l.36-2.54c.58-.23 1.12-.54 1.63-.95l2.39.96c.26.11.55.01.69-.23l1.93-3.34a.5.5 0 0 0-.12-.64l-2.03-1.59zM13 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z"/>
    </svg>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const time = useClock();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (!menuRef.current || !btnRef.current) return;
      if (menuRef.current.contains(t) || btnRef.current.contains(t)) return;
      setMenuOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key === ",") { e.preventDefault(); navigate("/settings"); }
      if (meta && e.key.toLowerCase() === "m") { e.preventDefault(); navigate("/core"); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const title = useMemo(() => {
    const p = location.pathname.replace(/^\//, "");
    if (!p) return "Homeview";
    return p.split("/")[0].toUpperCase();
  }, [location.pathname]);

  return (
    <header className="zeb-header" role="banner">
      <div className="zeb-header-left">
        <button
          ref={btnRef}
          className="zeb-logo-btn"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Open user menu"
          onClick={() => setMenuOpen(v => !v)}
        >
          <div className="zeb-logo">Z</div>
          <ChevronDownIcon />
        </button>

        <div className="zeb-brand-wrap" aria-label="Zebulon brand and clock">
          <span className="zeb-brand">Zebulon</span>
          <span className="zeb-clock" aria-live="polite">{time}</span>
        </div>
      </div>

      <div className="zeb-header-center">
        <span className="zeb-crumb" title={location.pathname}>{title}</span>
      </div>

      <div className="zeb-header-right">
        <button
          className="zeb-icon-btn"
          onClick={() => navigate("/core")}
          title="Zebulon Core — Memory Database Access (⌘/Ctrl + M)"
          aria-label="Open Zebulon Core"
        >
          <DatabaseIcon /><span className="zeb-icon-label">Core</span>
        </button>
        <button
          className="zeb-icon-btn"
          onClick={() => navigate("/settings")}
          title="System Settings (⌘/Ctrl + ,)"
          aria-label="Open Settings"
        >
          <SettingsIcon /><span className="zeb-icon-label">Settings</span>
        </button>
      </div>

      {menuOpen && (
        <div className="zeb-user-menu" role="menu" ref={menuRef} aria-label="User menu">
          <button role="menuitem" onClick={() => { navigate("/"); setMenuOpen(false); }}>Dashboard</button>
          <button role="menuitem" onClick={() => { navigate("/zed"); setMenuOpen(false); }}>Zed Lite</button>
          <button role="menuitem" onClick={() => { navigate("/core"); setMenuOpen(false); }}>Zebulon Core</button>
          <button role="menuitem" onClick={() => { navigate("/settings"); setMenuOpen(false); }}>Settings</button>
          <hr />
          <button role="menuitem" onClick={() => { navigate("/about"); setMenuOpen(false); }}>About</button>
        </div>
      )}
    </header>
  );
}
