"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("react-dom/client");
require("./index.css");
var react_1 = require("react");
var App = react_1.default.lazy(function () { return Promise.resolve().then(function () { return require("./App"); }); });
function ErrorBoundary(_a) {
    var children = _a.children;
    var _b = react_1.default.useState(false), hasError = _b[0], setHasError = _b[1];
    var _c = react_1.default.useState(null), error = _c[0], setError = _c[1];
    react_1.default.useEffect(function () {
        var handleError = function (event) {
            setHasError(true);
            setError(new Error(event.message));
            console.error("[Zebulon Debug] Window error:", event.message, event);
        };
        window.addEventListener('error', handleError);
        return function () { return window.removeEventListener('error', handleError); };
    }, []);
    if (hasError) {
        return (<div style={{
                color: 'white',
                backgroundColor: 'black',
                padding: '20px',
                fontFamily: 'monospace',
                minHeight: '100vh'
            }}>
        <h1>🚀 Zebulon AI System</h1>
        <p>Loading issue detected. Troubleshooting...</p>
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #333', background: '#222' }}>
          <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}</p>
          {(error === null || error === void 0 ? void 0 : error.stack) && (<pre style={{ color: '#ffb', fontSize: '0.9em', marginTop: '10px', whiteSpace: 'pre-wrap' }}>{error.stack}</pre>)}
          <p style={{ color: '#ccc', marginTop: '10px' }}>Check the browser console for more details.</p>
        </div>
        <button onClick={function () { return window.location.reload(); }} style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
            }}>
          Reload Application
        </button>
      </div>);
    }
    return <>{children}</>;
}
function Loading() {
    react_1.default.useEffect(function () {
        console.log('[Zebulon Debug] Loading component mounted');
    }, []);
    return (<div style={{
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
    </div>);
}
var rootElement = document.getElementById("root");
console.log('[Zebulon Debug] rootElement:', rootElement);
if (!rootElement) {
    console.error('[Zebulon Automation] No #root element found. White/black screen likely.');
    throw new Error("Root element not found");
}
try {
    var root = (0, client_1.createRoot)(rootElement);
    console.log('[Zebulon Debug] React root created, rendering...');
    root.render(<ErrorBoundary>
      <react_1.default.Suspense fallback={<Loading />}>
        <App />
      </react_1.default.Suspense>
    </ErrorBoundary>);
    console.log('[Zebulon Debug] Zebulon UI mounted successfully');
    // Automation: detect white/black screen after mount
    setTimeout(function () {
        var bg = window.getComputedStyle(document.body).backgroundColor;
        var appContent = rootElement.innerText.trim();
        if ((bg === 'rgb(0, 0, 0)' || bg === '#000' || bg === 'black') && !appContent) {
            console.error('[Zebulon Automation] Black screen detected after mount.');
        }
        if ((bg === 'rgb(255, 255, 255)' || bg === '#fff' || bg === 'white') && !appContent) {
            console.error('[Zebulon Automation] White screen detected after mount.');
        }
    }, 2000);
}
catch (error) {
    console.error("❌ Failed to mount Zebulon UI:", error);
    if (rootElement) {
        rootElement.innerHTML = "\n      <div style=\"color: white; background: red; padding: 20px; font-family: monospace;\">\n        <h1>\u274C Critical Error</h1>\n        <p>React failed to initialize: ".concat(error, "</p>\n        <p>Check browser console for details</p>\n      </div>\n    ");
    }
}
