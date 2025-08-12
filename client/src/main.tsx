
import { createRoot } from "react-dom/client";
import "./index.css";
import React from "react";

const App = React.lazy(() => import("./App"));

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(new Error(event.message));
      console.error("[Zebulon Debug] Window error:", event.message, event);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div style={{ 
        color: 'white', 
        backgroundColor: 'black', 
        padding: '20px', 
        fontFamily: 'monospace',
        minHeight: '100vh'
      }}>
        <h1>🚀 Zebulon AI System</h1>
        <p>Loading issue detected. Troubleshooting...</p>
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #333' }}>
          <p>Node.js: {process.version}</p>
          <p>Vite: {import.meta.env.VITE_VITE_VERSION || 'unknown'}</p>
          <p>Error: {error?.message || 'Unknown error'}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            marginTop: '20px', 
            padding: '10px 20px', 
            backgroundColor: '#333', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          Reload Application
        </button>
      </div>
    );
  }
  return <>{children}</>;
}

function Loading() {
  React.useEffect(() => {
    console.log('[Zebulon Debug] Loading component mounted');
  }, []);
  return (
    <div style={{ 
      color: 'white', 
      backgroundColor: 'black', 
      padding: '20px', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <h1>🚀 Zebulon AI System</h1>
        <p>Initializing...</p>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
console.log('[Zebulon Debug] rootElement:', rootElement);
if (!rootElement) {
  console.error('[Zebulon Automation] No #root element found. White/black screen likely.');
  throw new Error("Root element not found");
}

try {
  const root = createRoot(rootElement);
  console.log('[Zebulon Debug] React root created, rendering...');
  root.render(
    <ErrorBoundary>
      <React.Suspense fallback={<Loading />}>
        <App />
      </React.Suspense>
    </ErrorBoundary>
  );
  console.log('[Zebulon Debug] Zebulon UI mounted successfully');

  // Automation: detect white/black screen after mount
  setTimeout(() => {
    const bg = window.getComputedStyle(document.body).backgroundColor;
    const rootContent = rootElement.innerText.trim();
    if ((bg === 'rgb(0, 0, 0)' || bg === '#000' || bg === 'black') && !rootContent) {
      console.error('[Zebulon Automation] Black screen detected after mount.');
    }
    if ((bg === 'rgb(255, 255, 255)' || bg === '#fff' || bg === 'white') && !rootContent) {
      console.error('[Zebulon Automation] White screen detected after mount.');
    }
  }, 2000);

} catch (error) {
  console.error("❌ Failed to mount Zebulon UI:", error);
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="color: white; background: red; padding: 20px; font-family: monospace;">
        <h1>❌ Critical Error</h1>
        <p>React failed to initialize: ${error}</p>
        <p>Check browser console for details</p>
      </div>
    `;
  }
}
